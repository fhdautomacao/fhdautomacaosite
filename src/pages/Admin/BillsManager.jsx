import React, { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  FileText,
  Calendar,
  DollarSign
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import PaymentReceiptUpload from '@/components/PaymentReceiptUpload'
import { billsAPI } from '@/api/bills'

export default function BillsManager() {
  const [bills, setBills] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showInstallmentModal, setShowInstallmentModal] = useState(false)
  const [selectedBill, setSelectedBill] = useState(null)
  const [selectedInstallment, setSelectedInstallment] = useState(null)
  const [formData, setFormData] = useState({
    company_name: '',
    total_amount: '',
    installments: 1,
    first_due_date: '',
    description: '',
    type: 'receivable',
    admin_notes: ''
  })

  useEffect(() => {
    loadBills()
  }, [])

  const loadBills = async () => {
    try {
      setLoading(true)
      const data = await billsAPI.getAll()
      setBills(data)
    } catch (error) {
      console.error('Erro ao carregar boletos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateBill = async () => {
    try {
      await billsAPI.create(formData)
      setShowCreateModal(false)
      setFormData({
        company_name: '',
        total_amount: '',
        installments: 1,
        first_due_date: '',
        description: '',
        type: 'receivable',
        admin_notes: ''
      })
      loadBills()
    } catch (error) {
      console.error('Erro ao criar boleto:', error)
      alert('Erro ao criar boleto. Tente novamente.')
    }
  }

  const handleUpdateBill = async () => {
    try {
      await billsAPI.update(selectedBill.id, formData)
      setShowEditModal(false)
      loadBills()
    } catch (error) {
      console.error('Erro ao atualizar boleto:', error)
      alert('Erro ao atualizar boleto. Tente novamente.')
    }
  }

  const handleDeleteBill = async (billId) => {
    if (!confirm('Tem certeza que deseja excluir este boleto?')) return
    
    try {
      await billsAPI.delete(billId)
      loadBills()
    } catch (error) {
      console.error('Erro ao excluir boleto:', error)
      alert('Erro ao excluir boleto. Tente novamente.')
    }
  }

  const handleUpdateInstallment = async () => {
    try {
      await billsAPI.updateInstallment(selectedInstallment.id, {
        status: selectedInstallment.status,
        paid_date: selectedInstallment.status === 'paid' ? new Date().toISOString().split('T')[0] : null,
        payment_notes: selectedInstallment.payment_notes
      })
      
      // Atualizar o estado local do selectedBill
      if (selectedBill) {
        const updatedInstallments = selectedBill.bill_installments?.map(installment => 
          installment.id === selectedInstallment.id 
            ? { ...installment, ...selectedInstallment }
            : installment
        )
        
        setSelectedBill({
          ...selectedBill,
          bill_installments: updatedInstallments
        })
      }
      
      // Atualizar também na lista de boletos
      setBills(prevBills => 
        prevBills.map(bill => {
          if (bill.id === selectedBill?.id) {
            return {
              ...bill,
              bill_installments: bill.bill_installments?.map(installment => 
                installment.id === selectedInstallment.id 
                  ? { ...installment, ...selectedInstallment }
                  : installment
              )
            }
          }
          return bill
        })
      )
      
      setShowInstallmentModal(false)
      setSelectedInstallment(null)
    } catch (err) {
      console.error("Erro ao atualizar parcela:", err)
      
      // Tratamento específico de erros
      let errorMessage = "Erro ao atualizar parcela. Tente novamente."
      
      if (err.code) {
        switch (err.code) {
          case '22001':
            if (err.message.includes('payment_notes')) {
              errorMessage = "Observações de pagamento muito longas."
            } else {
              errorMessage = "Campo muito longo. Verifique os dados inseridos."
            }
            break
          case '23502':
            errorMessage = "Campo obrigatório não preenchido."
            break
          case '23514':
            errorMessage = "Status inválido. Use 'pending', 'paid', 'overdue' ou 'cancelled'."
            break
          case '22P02':
            errorMessage = "Formato de data inválido."
            break
          case '42501':
            errorMessage = "Sem permissão para atualizar parcelas. Verifique suas credenciais."
            break
          case '42P01':
            errorMessage = "Erro de configuração do banco de dados. Contate o administrador."
            break
          case 'PGRST116':
            errorMessage = "Parcela não encontrada ou já foi removida."
            break
          default:
            if (err.message) {
              errorMessage = `Erro: ${err.message}`
            }
        }
      } else if (err.message) {
        errorMessage = err.message
      }
      
      alert(errorMessage)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      case 'cancelled': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'receivable': return 'bg-blue-100 text-blue-800'
      case 'payable': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount)
  }

  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || bill.status === statusFilter
    const matchesType = typeFilter === 'all' || bill.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const totalReceivable = bills
    .filter(bill => bill.type === 'receivable' && bill.status === 'pending')
    .reduce((sum, bill) => sum + parseFloat(bill.total_amount || 0), 0)

  const totalOverdue = bills
    .filter(bill => bill.status === 'overdue')
    .reduce((sum, bill) => sum + parseFloat(bill.total_amount || 0), 0)

  const pendingInstallments = bills
    .filter(bill => bill.status === 'pending')
    .flatMap(bill => bill.bill_installments || [])
    .filter(installment => installment.status === 'pending')

  const overdueInstallments = bills
    .flatMap(bill => bill.bill_installments || [])
    .filter(installment => installment.status === 'overdue')

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Boletos</h1>
          <p className="text-gray-600">Gerencie todos os boletos e parcelas</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Boleto
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total a Receber</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalReceivable)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <Calendar className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Vencidos</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalOverdue)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FileText className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Parcelas Pendentes</p>
              <p className="text-2xl font-bold text-gray-900">{pendingInstallments.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <Calendar className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Parcelas Vencidas</p>
              <p className="text-2xl font-bold text-gray-900">{overdueInstallments.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar boletos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="receivable">A Receber</SelectItem>
            <SelectItem value="payable">A Pagar</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="paid">Pago</SelectItem>
            <SelectItem value="overdue">Vencido</SelectItem>
            <SelectItem value="cancelled">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bills List */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Empresa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parcelas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBills.map((bill) => (
                <tr key={bill.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {bill.company_name}
                      </div>
                      {bill.description && (
                        <div className="text-sm text-gray-500">{bill.description}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={getTypeColor(bill.type)}>
                      {bill.type === 'receivable' ? 'A Receber' : 'A Pagar'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(bill.total_amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={getStatusColor(bill.status)}>
                      {bill.status === 'pending' ? 'Pendente' : 
                       bill.status === 'paid' ? 'Pago' : 
                       bill.status === 'overdue' ? 'Vencido' : 'Cancelado'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {bill.bill_installments?.length || 0} parcelas
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedBill(bill)
                          setShowDetailsModal(true)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedBill(bill)
                          setFormData({
                            company_name: bill.company_name,
                            total_amount: bill.total_amount,
                            installments: bill.bill_installments?.length || 1,
                            first_due_date: bill.bill_installments?.[0]?.due_date?.split('T')[0] || '',
                            description: bill.description || '',
                            type: bill.type,
                            admin_notes: bill.admin_notes || ''
                          })
                          setShowEditModal(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteBill(bill.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Novo Boleto</DialogTitle>
            <DialogDescription>
              Crie um novo boleto com parcelas.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Empresa</Label>
              <Input
                value={formData.company_name}
                onChange={(e) => setFormData({...formData, company_name: e.target.value})}
              />
            </div>
            
            <div>
              <Label>Valor Total</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.total_amount}
                onChange={(e) => setFormData({...formData, total_amount: e.target.value})}
              />
            </div>
            
            <div>
              <Label>Número de Parcelas</Label>
              <Input
                type="number"
                min="1"
                value={formData.installments}
                onChange={(e) => setFormData({...formData, installments: parseInt(e.target.value)})}
              />
            </div>
            
            <div>
              <Label>Data do Primeiro Vencimento</Label>
              <Input
                type="date"
                value={formData.first_due_date}
                onChange={(e) => setFormData({...formData, first_due_date: e.target.value})}
              />
            </div>
            
            <div className="col-span-2">
              <Label>Descrição</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
              />
            </div>
            
            <div className="col-span-2">
              <Label>Observações</Label>
              <Textarea
                value={formData.admin_notes}
                onChange={(e) => setFormData({...formData, admin_notes: e.target.value})}
                rows={2}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateBill}>
              Criar Boleto
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Boleto</DialogTitle>
            <DialogDescription>
              Edite as informações do boleto.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Empresa</Label>
              <Input
                value={formData.company_name}
                onChange={(e) => setFormData({...formData, company_name: e.target.value})}
              />
            </div>
            
            <div>
              <Label>Valor Total</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.total_amount}
                onChange={(e) => setFormData({...formData, total_amount: e.target.value})}
              />
            </div>
            
            <div className="col-span-2">
              <Label>Descrição</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
              />
            </div>
            
            <div className="col-span-2">
              <Label>Observações</Label>
              <Textarea
                value={formData.admin_notes}
                onChange={(e) => setFormData({...formData, admin_notes: e.target.value})}
                rows={2}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateBill}>
              Salvar Alterações
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Boleto</DialogTitle>
            <DialogDescription>
              Visualize todas as informações e parcelas do boleto.
            </DialogDescription>
          </DialogHeader>
          
          {selectedBill && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Empresa</Label>
                  <p className="text-gray-900">{selectedBill.company_name}</p>
                </div>
                <div>
                  <Label className="font-semibold">Tipo</Label>
                  <Badge className={getTypeColor(selectedBill.type)}>
                    {selectedBill.type === 'receivable' ? 'A Receber' : 'A Pagar'}
                  </Badge>
                </div>
                <div>
                  <Label className="font-semibold">Valor Total</Label>
                  <p className="text-gray-900 font-semibold">{formatCurrency(selectedBill.total_amount)}</p>
                </div>
                <div>
                  <Label className="font-semibold">Status</Label>
                  <Badge className={getStatusColor(selectedBill.status)}>
                    {selectedBill.status === 'pending' ? 'Pendente' : 
                     selectedBill.status === 'paid' ? 'Pago' : 
                     selectedBill.status === 'overdue' ? 'Vencido' : 'Cancelado'}
                  </Badge>
                </div>
                <div className="col-span-2">
                  <Label className="font-semibold">Descrição</Label>
                  <p className="text-gray-900">{selectedBill.description}</p>
                </div>
                {selectedBill.admin_notes && (
                  <div className="col-span-2">
                    <Label className="font-semibold">Observações</Label>
                    <p className="text-gray-900">{selectedBill.admin_notes}</p>
                  </div>
                )}
              </div>
              
              <div>
                <h4 className="font-semibold text-lg mb-4">Parcelas</h4>
                <div className="space-y-2">
                  {selectedBill.bill_installments?.map((installment) => (
                    <div key={installment.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <span className="font-medium">Parcela {installment.installment_number}</span>
                          <p className="text-sm text-gray-600">
                            Vencimento: {new Date(installment.due_date).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div>
                          <span className="font-semibold">{formatCurrency(installment.amount)}</span>
                        </div>
                        <Badge className={getStatusColor(installment.status)}>
                          {installment.status === 'pending' ? 'Pendente' : 
                           installment.status === 'paid' ? 'Pago' : 
                           installment.status === 'overdue' ? 'Vencido' : 'Cancelado'}
                        </Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedInstallment(installment)
                          setShowInstallmentModal(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Installment Modal */}
      <Dialog open={showInstallmentModal} onOpenChange={setShowInstallmentModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Parcela</DialogTitle>
            <DialogDescription>
              Atualize o status e informações da parcela.
            </DialogDescription>
          </DialogHeader>
          
          {selectedInstallment && (
            <div className="space-y-6">
              {/* Informações da parcela */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Vencimento</p>
                    <p className="font-medium">{new Date(selectedInstallment.due_date).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Valor</p>
                    <p className="font-medium">{formatCurrency(selectedInstallment.amount)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(selectedInstallment.status)}>
                    {selectedInstallment.status === 'pending' ? 'Pendente' : 
                     selectedInstallment.status === 'paid' ? 'Pago' : 
                     selectedInstallment.status === 'overdue' ? 'Vencido' : 'Cancelado'}
                  </Badge>
                </div>
              </div>

              {/* Status e Observações */}
              <div className="space-y-4">
                <div>
                  <Label>Status</Label>
                  <Select 
                    value={selectedInstallment.status} 
                    onValueChange={(value) => setSelectedInstallment({...selectedInstallment, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="paid">Pago</SelectItem>
                      <SelectItem value="overdue">Vencido</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Observações do Pagamento</Label>
                  <Textarea
                    value={selectedInstallment.payment_notes || ''}
                    onChange={(e) => setSelectedInstallment({...selectedInstallment, payment_notes: e.target.value})}
                    placeholder="Observações sobre o pagamento..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Upload de Comprovante */}
              <PaymentReceiptUpload
                billId={selectedBill?.id}
                installment={selectedInstallment}
                onUploadSuccess={(result) => {
                  // Atualizar o estado local com as informações do comprovante
                  setSelectedInstallment({
                    ...selectedInstallment,
                    payment_receipt_url: result.url,
                    payment_receipt_filename: result.filename,
                    status: 'paid' // Marcar como pago automaticamente
                  })
                  
                  // Atualizar também o selectedBill
                  if (selectedBill) {
                    const updatedInstallments = selectedBill.bill_installments?.map(installment => 
                      installment.id === selectedInstallment.id 
                        ? { ...installment, ...selectedInstallment }
                        : installment
                    )
                    
                    setSelectedBill({
                      ...selectedBill,
                      bill_installments: updatedInstallments
                    })
                  }
                }}
                onUploadError={(error) => {
                  console.error('Erro no upload:', error)
                  alert(`Erro ao fazer upload: ${error}`)
                }}
              />
            </div>
          )}
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowInstallmentModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateInstallment}>
              Salvar Alterações
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 