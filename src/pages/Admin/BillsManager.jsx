import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  DollarSign, 
  Calendar,
  Building,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
  Download,
  Upload
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { billsAPI } from '@/api/bills'
import { useAuth } from '@/contexts/AuthContext'

const BillsManager = () => {
  const { userPermissions } = useAuth()
  const [bills, setBills] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedBill, setSelectedBill] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showInstallmentModal, setShowInstallmentModal] = useState(false)
  const [selectedInstallment, setSelectedInstallment] = useState(null)

  const [formData, setFormData] = useState({
    type: 'receivable',
    company_name: '',
    description: '',
    total_amount: '',
    installments: 1,
    installment_interval: 30,
    first_due_date: '',
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
    } catch (err) {
      console.error("Erro ao carregar boletos:", err)
      setError("Não foi possível carregar os boletos.")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateBill = async () => {
    try {
      const billData = {
        ...formData,
        total_amount: parseFloat(formData.total_amount),
        installments: parseInt(formData.installments),
        installment_interval: parseInt(formData.installment_interval)
      }

      const newBill = await billsAPI.create(billData)
      
      // Gerar parcelas automaticamente
      await billsAPI.generateInstallments(
        newBill.id,
        billData.total_amount,
        billData.installments,
        billData.installment_interval,
        billData.first_due_date
      )

      setShowCreateModal(false)
      setFormData({
        type: 'receivable',
        company_name: '',
        description: '',
        total_amount: '',
        installments: 1,
        installment_interval: 30,
        first_due_date: '',
        admin_notes: ''
      })
      loadBills()
    } catch (err) {
      console.error("Erro ao criar boleto:", err)
      alert("Erro ao criar boleto. Tente novamente.")
    }
  }

  const handleUpdateBill = async () => {
    try {
      await billsAPI.update(selectedBill.id, {
        company_name: formData.company_name,
        description: formData.description,
        total_amount: parseFloat(formData.total_amount),
        admin_notes: formData.admin_notes
      })
      
      setShowEditModal(false)
      setSelectedBill(null)
      loadBills()
    } catch (err) {
      console.error("Erro ao atualizar boleto:", err)
      alert("Erro ao atualizar boleto. Tente novamente.")
    }
  }

  const handleDeleteBill = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este boleto?")) {
      try {
        await billsAPI.delete(id)
        loadBills()
      } catch (err) {
        console.error("Erro ao deletar boleto:", err)
        alert("Erro ao deletar boleto. Tente novamente.")
      }
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
      alert("Erro ao atualizar parcela. Tente novamente.")
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
    return type === 'receivable' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || bill.type === filterType
    const matchesStatus = filterStatus === 'all' || bill.status === filterStatus
    
    return matchesSearch && matchesType && matchesStatus
  })

  if (!userPermissions.canAccessBills) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Acesso Negado</h3>
          <p className="text-gray-600">Você não tem permissão para acessar esta seção.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gerenciar Boletos</h2>
          <p className="text-gray-600">Controle de boletos a pagar e a receber</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Boleto
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total a Receber</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(bills.filter(b => b.type === 'receivable' && b.status === 'pending').reduce((sum, b) => sum + b.total_amount, 0))}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total a Pagar</p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatCurrency(bills.filter(b => b.type === 'payable' && b.status === 'pending').reduce((sum, b) => sum + b.total_amount, 0))}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Vencidos</p>
                <p className="text-2xl font-bold text-red-600">
                  {bills.filter(b => b.status === 'overdue').length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Boletos</p>
                <p className="text-2xl font-bold text-blue-600">{bills.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Buscar</Label>
              <Input
                placeholder="Empresa ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Label>Tipo</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="receivable">A Receber</SelectItem>
                  <SelectItem value="payable">A Pagar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
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
            <div className="flex items-end">
              <Button variant="outline" onClick={loadBills}>
                <Filter className="h-4 w-4 mr-2" />
                Atualizar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bills List */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Carregando boletos...</p>
        </div>
      ) : filteredBills.length === 0 ? (
        <div className="text-center py-8">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum boleto encontrado</h3>
          <p className="text-gray-600">
            {bills.length === 0 ? 'Ainda não há boletos cadastrados' : 'Nenhum boleto corresponde aos filtros aplicados'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredBills.map((bill) => (
            <Card key={bill.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{bill.company_name}</h3>
                      <Badge className={getTypeColor(bill.type)}>
                        {bill.type === 'receivable' ? 'A Receber' : 'A Pagar'}
                      </Badge>
                      <Badge className={getStatusColor(bill.status)}>
                        {bill.status === 'pending' ? 'Pendente' : 
                         bill.status === 'paid' ? 'Pago' : 
                         bill.status === 'overdue' ? 'Vencido' : 'Cancelado'}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{bill.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-500">Valor Total:</span>
                        <p className="font-semibold text-gray-900">{formatCurrency(bill.total_amount)}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-500">Parcelas:</span>
                        <p className="font-semibold text-gray-900">{bill.installments}x</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-500">Vencimento:</span>
                        <p className="font-semibold text-gray-900">
                          {new Date(bill.first_due_date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-500">Criado:</span>
                        <p className="font-semibold text-gray-900">
                          {new Date(bill.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
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
                          type: bill.type,
                          company_name: bill.company_name,
                          description: bill.description,
                          total_amount: bill.total_amount.toString(),
                          installments: bill.installments,
                          installment_interval: bill.installment_interval,
                          first_due_date: bill.first_due_date,
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Criar Novo Boleto</DialogTitle>
            <DialogDescription>
              Preencha os dados do boleto. As parcelas serão geradas automaticamente.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tipo</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="receivable">A Receber</SelectItem>
                  <SelectItem value="payable">A Pagar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Empresa</Label>
              <Input
                value={formData.company_name}
                onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                placeholder="Nome da empresa"
              />
            </div>
            
            <div className="col-span-2">
              <Label>Descrição</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Descrição do serviço ou produto"
                rows={3}
              />
            </div>
            
            <div>
              <Label>Valor Total</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.total_amount}
                onChange={(e) => setFormData({...formData, total_amount: e.target.value})}
                placeholder="0,00"
              />
            </div>
            
            <div>
              <Label>Número de Parcelas</Label>
              <Input
                type="number"
                value={formData.installments}
                onChange={(e) => setFormData({...formData, installments: parseInt(e.target.value) || 1})}
                min="1"
              />
            </div>
            
            <div>
              <Label>Intervalo entre Parcelas (dias)</Label>
              <Input
                type="number"
                value={formData.installment_interval}
                onChange={(e) => setFormData({...formData, installment_interval: parseInt(e.target.value) || 30})}
                min="1"
              />
            </div>
            
            <div>
              <Label>Primeiro Vencimento</Label>
              <Input
                type="date"
                value={formData.first_due_date}
                onChange={(e) => setFormData({...formData, first_due_date: e.target.value})}
              />
            </div>
            
            <div className="col-span-2">
              <Label>Observações</Label>
              <Textarea
                value={formData.admin_notes}
                onChange={(e) => setFormData({...formData, admin_notes: e.target.value})}
                placeholder="Observações adicionais..."
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Parcela</DialogTitle>
            <DialogDescription>
              Atualize o status e informações da parcela.
            </DialogDescription>
          </DialogHeader>
          
          {selectedInstallment && (
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
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowInstallmentModal(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleUpdateInstallment}>
                  Salvar Alterações
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default BillsManager 