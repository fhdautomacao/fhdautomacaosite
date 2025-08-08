import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import uploadService from '@/services/uploadService';
import { 
  Upload, 
  FileText, 
  Download, 
  Trash2, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  DollarSign
} from 'lucide-react';

const PaymentReceiptUpload = ({ 
  billId, 
  installment, 
  billData, // Dados do bill para informações da empresa
  onUploadSuccess, 
  onUploadError,
  isUploading = false 
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Apenas arquivos PDF são permitidos');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('Arquivo muito grande. Máximo: 10MB');
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Selecione um arquivo para upload');
      return;
    }

    try {
      setUploadProgress(0);
      setError(null);

      // Simula barra de progresso (opcional)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) { clearInterval(progressInterval); return prev; }
          return prev + 10;
        });
      }, 200);

      // Upload direto para Supabase Storage
      const result = await uploadService.uploadPaymentReceipt(selectedFile, billId, installment.installment_number);

      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (result.success) {
        setSuccess('Comprovante enviado com sucesso!');
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (onUploadSuccess) {
          onUploadSuccess({
            url: result.url,
            filename: result.filename,
            path: result.path
          });
        }
      } else {
        throw new Error(result.error || 'Erro no upload');
      }

      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Erro no upload:', error);
      setError(error.message || 'Erro ao fazer upload do arquivo');
      if (onUploadError) onUploadError(error);
    } finally {
      setUploadProgress(0);
    }
  };

  const handleDownload = async () => {
    if (!installment.payment_receipt_url) return;

    try {
      const response = await fetch(installment.payment_receipt_url);
      const blob = await response.blob();
      const companyName = billData?.company_name || 'Empresa';
      const dueDate = installment.due_date ? new Date(installment.due_date).toLocaleDateString('pt-BR').replace(/\//g, '-') : 'Data';
      const amount = installment.amount ? installment.amount.toString().replace('.', ',').replace(',', '-') : 'Valor';
      const installmentNumber = installment.installment_number || '';
      const descriptiveName = `${companyName}_${dueDate}_R$${amount}_Parcela${installmentNumber}_Comprovante.pdf`;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = descriptiveName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erro ao baixar arquivo:', error);
      setError('Erro ao baixar arquivo');
    }
  };

  const handleDelete = async () => {
    if (!installment.payment_receipt_url || !installment.payment_receipt_filename) return;
    if (!confirm('Tem certeza que deseja excluir este comprovante?')) return;

    try {
      const pathGuess = installment.payment_receipt_filename?.includes('/')
        ? installment.payment_receipt_filename
        : `payment-receipts/${billId}/${installment.payment_receipt_filename}`;
      const result = await uploadService.deletePaymentReceipt(pathGuess);
      if (!result.success) throw new Error(result.error || 'Erro ao deletar comprovante');
      setSuccess('Comprovante excluído com sucesso!');
      if (onUploadSuccess) onUploadSuccess({ action: 'delete' });
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Erro ao excluir comprovante:', error);
      setError('Erro ao excluir comprovante');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === 'null' || dateString === 'undefined') return 'Data não disponível';
    try { const date = new Date(dateString); return isNaN(date.getTime()) ? 'Data inválida' : date.toLocaleDateString('pt-BR'); } catch { return 'Data inválida'; }
  };

  const formatCurrency = (amount) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Comprovante de Pagamento
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Info da parcela */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm text-gray-600">Vencimento</p>
              <p className="font-medium truncate">{formatDate(installment.due_date)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <DollarSign className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm text-gray-600">Valor</p>
              <p className="font-medium truncate">{formatCurrency(installment.amount)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:col-span-2 lg:col-span-1">
            <Badge className="flex-shrink-0">{installment.status === 'paid' ? 'Pago' : installment.status === 'overdue' ? 'Vencido' : 'Pendente'}</Badge>
          </div>
        </div>

        {/* Comprovante existente */}
        {installment.payment_receipt_url && (
          <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-green-800 mb-1">Comprovante enviado</p>
                <p className="text-sm text-green-600 break-all">{installment.payment_receipt_filename || 'Arquivo PDF'}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <Button variant="outline" size="sm" onClick={handleDownload} className="text-green-600 border-green-200 hover:bg-green-100">
                <Download className="h-4 w-4 mr-1" /> Baixar
              </Button>
              <Button variant="outline" size="sm" onClick={handleDelete} className="text-red-600 border-red-200 hover:bg-red-100">
                <Trash2 className="h-4 w-4 mr-1" /> Excluir
              </Button>
            </div>
          </div>
        )}

        {/* Upload */}
        {!installment.payment_receipt_url && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="receipt-file">Selecionar arquivo PDF</Label>
              <Input id="receipt-file" type="file" accept=".pdf" onChange={handleFileSelect} ref={fileInputRef} className="mt-1" />
              <p className="text-xs text-gray-500 mt-1">Apenas arquivos PDF, máximo 10MB</p>
            </div>
            {selectedFile && (
              <div className="p-3 border border-blue-200 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-blue-800 break-all">{selectedFile.name}</p>
                    <p className="text-sm text-blue-600">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
              </div>
            )}
            <Button onClick={handleUpload} disabled={!selectedFile || isUploading} className="w-full">
              <Upload className="h-4 w-4 mr-2" /> Enviar Comprovante
            </Button>
          </div>
        )}

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
          </div>
        )}

        {error && (
          <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>
        )}
        {success && (
          <Alert><CheckCircle className="h-4 w-4" /><AlertDescription>{success}</AlertDescription></Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentReceiptUpload;
