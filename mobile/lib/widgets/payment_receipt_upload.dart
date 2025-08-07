import 'dart:io';
import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';

import '../core/services/upload_service.dart';
import '../core/constants/app_colors.dart';
import '../core/constants/app_strings.dart';

class PaymentReceiptUpload extends StatefulWidget {
  final String billId;
  final Map<String, dynamic> installment;
  final Function(Map<String, dynamic>)? onUploadSuccess;
  final Function(String)? onUploadError;

  const PaymentReceiptUpload({
    super.key,
    required this.billId,
    required this.installment,
    this.onUploadSuccess,
    this.onUploadError,
  });

  @override
  State<PaymentReceiptUpload> createState() => _PaymentReceiptUploadState();
}

class _PaymentReceiptUploadState extends State<PaymentReceiptUpload> {
  bool _isUploading = false;
  String? _error;
  String? _success;

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.all(16),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Cabeçalho
            Row(
              children: [
                Icon(
                  Icons.receipt_long,
                  color: AppColors.primary,
                  size: 24,
                ),
                const SizedBox(width: 8),
                Text(
                  'Comprovante de Pagamento',
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Informações da parcela
            _buildInstallmentInfo(),

            const SizedBox(height: 16),

            // Comprovante existente
            if (widget.installment['payment_receipt_url'] != null)
              _buildExistingReceipt(),

            // Upload de novo comprovante
            if (widget.installment['payment_receipt_url'] == null)
              _buildUploadSection(),

            // Mensagens de erro/sucesso
            if (_error != null) _buildErrorMessage(),
            if (_success != null) _buildSuccessMessage(),
          ],
        ),
      ),
    );
  }

  Widget _buildInstallmentInfo() {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.grey50,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Parcela ${widget.installment['installment_number']}',
                  style: const TextStyle(
                    fontWeight: FontWeight.w600,
                    fontSize: 16,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Vencimento: ${_formatDate(widget.installment['due_date'])}',
                  style: TextStyle(
                    color: AppColors.textSecondary,
                    fontSize: 14,
                  ),
                ),
                Text(
                  'Valor: ${_formatCurrency(widget.installment['amount'])}',
                  style: TextStyle(
                    color: AppColors.textSecondary,
                    fontSize: 14,
                  ),
                ),
              ],
            ),
          ),
          _buildStatusBadge(),
        ],
      ),
    );
  }

  Widget _buildStatusBadge() {
    final status = widget.installment['status'];
    Color badgeColor;
    String statusText;

    switch (status) {
      case 'paid':
        badgeColor = Colors.green;
        statusText = 'Pago';
        break;
      case 'overdue':
        badgeColor = Colors.red;
        statusText = 'Vencido';
        break;
      default:
        badgeColor = Colors.orange;
        statusText = 'Pendente';
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: badgeColor.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: badgeColor),
      ),
      child: Text(
        statusText,
        style: TextStyle(
          color: badgeColor,
          fontWeight: FontWeight.w600,
          fontSize: 12,
        ),
      ),
    );
  }

  Widget _buildExistingReceipt() {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.green.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.green.withOpacity(0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                Icons.check_circle,
                color: Colors.green,
                size: 20,
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  'Comprovante enviado',
                  style: TextStyle(
                    color: Colors.green.shade800,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            widget.installment['payment_receipt_filename'] ?? 'comprovante.pdf',
            style: TextStyle(
              color: Colors.green.shade700,
              fontSize: 14,
            ),
          ),
          Text(
            'Enviado em ${_formatDate(widget.installment['payment_receipt_uploaded_at'])}',
            style: TextStyle(
              color: Colors.green.shade600,
              fontSize: 12,
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: _downloadReceipt,
                  icon: const Icon(Icons.download, size: 16),
                  label: const Text('Baixar'),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: Colors.green.shade700,
                    side: BorderSide(color: Colors.green.shade300),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: _deleteReceipt,
                  icon: const Icon(Icons.delete, size: 16),
                  label: const Text('Excluir'),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: Colors.red.shade700,
                    side: BorderSide(color: Colors.red.shade300),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildUploadSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Selecionar arquivo PDF',
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
            fontWeight: FontWeight.w600,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          'Apenas arquivos PDF, máximo 10MB',
          style: TextStyle(
            color: AppColors.textSecondary,
            fontSize: 12,
          ),
        ),
        const SizedBox(height: 12),
        SizedBox(
          width: double.infinity,
          child: ElevatedButton.icon(
            onPressed: _isUploading ? null : _pickAndUploadFile,
            icon: _isUploading
                ? const SizedBox(
                    width: 16,
                    height: 16,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                : const Icon(Icons.upload_file),
            label: Text(_isUploading ? 'Enviando...' : 'Selecionar PDF'),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 12),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildErrorMessage() {
    return Container(
      margin: const EdgeInsets.only(top: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.red.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.red.withOpacity(0.3)),
      ),
      child: Row(
        children: [
          Icon(
            Icons.error_outline,
            color: Colors.red,
            size: 20,
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              _error!,
              style: TextStyle(
                color: Colors.red.shade700,
                fontSize: 14,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSuccessMessage() {
    return Container(
      margin: const EdgeInsets.only(top: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.green.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.green.withOpacity(0.3)),
      ),
      child: Row(
        children: [
          Icon(
            Icons.check_circle_outline,
            color: Colors.green,
            size: 20,
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              _success!,
              style: TextStyle(
                color: Colors.green.shade700,
                fontSize: 14,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _pickAndUploadFile() async {
    try {
      setState(() {
        _isUploading = true;
        _error = null;
        _success = null;
      });

      // Selecionar arquivo
      final result = await UploadService.pickPdfFile();
      if (result == null) return;

      final file = File(result.files.first.path!);
      
      // Fazer upload
      final uploadResult = await UploadService.uploadPaymentReceipt(
        billId: widget.billId,
        installmentNumber: widget.installment['installment_number'],
        file: file,
      );

      if (uploadResult.success) {
        setState(() {
          _success = 'Comprovante enviado com sucesso!';
        });

        // Callback de sucesso
        if (widget.onUploadSuccess != null) {
          widget.onUploadSuccess!({
            'action': 'upload',
            'url': uploadResult.url,
            'filename': uploadResult.filename,
          });
        }

        // Limpar sucesso após 3 segundos
        Future.delayed(const Duration(seconds: 3), () {
          if (mounted) {
            setState(() {
              _success = null;
            });
          }
        });
      } else {
        setState(() {
          _error = uploadResult.error;
        });

        if (widget.onUploadError != null) {
          widget.onUploadError!(_error!);
        }
      }
    } catch (e) {
      setState(() {
        _error = 'Erro ao fazer upload: $e';
      });

      if (widget.onUploadError != null) {
        widget.onUploadError!(_error!);
      }
    } finally {
      setState(() {
        _isUploading = false;
      });
    }
  }

  Future<void> _downloadReceipt() async {
    try {
      final url = widget.installment['payment_receipt_url'];
      final filename = widget.installment['payment_receipt_filename'] ?? 'comprovante.pdf';

      final downloadResult = await UploadService.downloadPaymentReceipt(
        url: url,
        filename: filename,
      );

      if (downloadResult.success) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Arquivo baixado: ${downloadResult.localPath}'),
            backgroundColor: Colors.green,
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Erro ao baixar: ${downloadResult.error}'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Erro ao baixar arquivo: $e'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  Future<void> _deleteReceipt() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Confirmar exclusão'),
        content: const Text('Tem certeza que deseja excluir este comprovante?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: const Text('Cancelar'),
          ),
          TextButton(
            onPressed: () => Navigator.of(context).pop(true),
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: const Text('Excluir'),
          ),
        ],
      ),
    );

    if (confirmed != true) return;

    try {
      final deleteResult = await UploadService.deletePaymentReceipt(
        billId: widget.billId,
        installmentId: widget.installment['id'],
      );

      if (deleteResult.success) {
        setState(() {
          _success = 'Comprovante excluído com sucesso!';
        });

        if (widget.onUploadSuccess != null) {
          widget.onUploadSuccess!({'action': 'delete'});
        }

        Future.delayed(const Duration(seconds: 3), () {
          if (mounted) {
            setState(() {
              _success = null;
            });
          }
        });
      } else {
        setState(() {
          _error = deleteResult.error;
        });
      }
    } catch (e) {
      setState(() {
        _error = 'Erro ao excluir comprovante: $e';
      });
    }
  }

  String _formatDate(String? dateString) {
    if (dateString == null) return 'N/A';
    try {
      final date = DateTime.parse(dateString);
      return '${date.day.toString().padLeft(2, '0')}/${date.month.toString().padLeft(2, '0')}/${date.year}';
    } catch (e) {
      return 'Data inválida';
    }
  }

  String _formatCurrency(dynamic amount) {
    if (amount == null) return 'R\$ 0,00';
    try {
      final value = double.parse(amount.toString());
      return 'R\$ ${value.toStringAsFixed(2).replaceAll('.', ',')}';
    } catch (e) {
      return 'R\$ 0,00';
    }
  }
}
