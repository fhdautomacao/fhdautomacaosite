import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Building, 
  FileText,
  DollarSign,
  Calculator,
  TrendingUp,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  CreditCard,
  Banknote,
  Timer,
  PiggyBank,
  RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import AdminModal from '@/components/admin/AdminModal'
import { ModalActionButton, ModalSection, ModalGrid } from '@/components/admin/AdminModal'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { profitSharingAPI } from '@/api/profitSharing'
import { companiesAPI } from '@/api/companies'
import { billsAPI } from '@/api/bills'
import { useAuth } from '@/contexts/AuthContext'

const ProfitSharingManager = () => {
  const { userPermissions } = useAuth()
  const [profitSharings, setProfitSharings] = useState([])
  const [companies, setCompanies] = useState([])
  const [bills, setBills] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedProfitSharing, setSelectedProfitSharing] = useState(null)
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [selectedBill, setSelectedBill] = useState(null)
  const [selectedInstallment, setSelectedInstallment] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showInstallmentModal, setShowInstallmentModal] = useState(false)
  
  // Estados para estatísticas financeiras
  const [statistics, setStatistics] = useState({
    totalToPay: 0,
    totalPaid: 0,
    totalPending: 0,
    totalOverdue: 0,
    averageProfit: 0
  })

  const [formData, setFormData] = useState({
    company_id: '',
    bill_id: '',
    company_name: '',
    bill_description: '',
    bill_amount: '',
    expenses: '',
    extras: '',
    installments: 1,
    installment_interval: 30,
    first_due_date: '',
    notes: ''
  })

  // Estados para validação
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadProfitSharings()
    loadCompanies()
    loadStatistics()
  }, [])

  const loadProfitSharings = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Atualizar status de pagamentos vencidos automaticamente
      try {
        await profitSharingAPI.updateOverdueStatus()
      } catch (updateError) {
        console.warn("Aviso: Não foi possível atualizar status de pagamentos vencidos:", updateError)
      }
      
      const data = await profitSharingAPI.getAll()
      setProfitSharings(data)
    } catch (err) {
      console.error("Erro ao carregar divisões de lucro:", err)
      setError("Não foi possível carregar as divisões de lucro.")
    } finally {
      setLoading(false)
    }
  }

  const loadCompanies = async () => {
    try {
      const data = await companiesAPI.getActive()
      setCompanies(data)
    } catch (err) {
      console.error("Erro ao carregar empresas:", err)
    }
  }

  const loadStatistics = async () => {
    try {
      const stats = await profitSharingAPI.getFinancialStatistics()
      setStatistics(stats)
    } catch (err) {
      console.error("Erro ao carregar estatísticas:", err)
    }
  }

  const loadBillsByCompany = async (companyId) => {
    try {
      const data = await billsAPI.getByCompany(companyId)
      setBills(data)
    } catch (err) {
      console.error("Erro ao carregar boletos:", err)
      setBills([])
    }
  }

  const handleCompanyChange = (companyId) => {
    const company = companies.find(c => c.id === companyId)
    setSelectedCompany(company)
    setFormData({
      ...formData,
      company_id: companyId,
      company_name: company?.name || '',
      bill_id: '',
      bill_description: '',
      bill_amount: ''
    })
    if (companyId) {
      loadBillsByCompany(companyId)
    } else {
      setBills([])
    }
  }

  const handleBillChange = (billId) => {
    const bill = bills.find(b => b.id === billId)
    setSelectedBill(bill)
    setFormData({
      ...formData,
      bill_id: billId,
      bill_description: bill?.description || '',
      bill_amount: bill?.total_amount || ''
    })
  }

  const calculateProfit = () => {
    const billAmount = parseFloat(formData.bill_amount) || 0
    const expenses = parseFloat(formData.expenses) || 0
    return billAmount - expenses
  }

  const calculatePartnerShare = () => {
    const profit = calculateProfit()
    const extras = parseFloat(formData.extras) || 0
    return (profit / 2) + extras
  }

  const calculateMyShare = () => {
    const profit = calculateProfit()
    return profit / 2
  }

  // Função para validar formulário
  const validateForm = () => {
    const newErrors = {}

    // Validação de empresa
    if (!formData.company_id) {
      newErrors.company_id = 'Empresa é obrigatória'
    }

    // Validação de boleto
    if (!formData.bill_id) {
      newErrors.bill_id = 'Boleto é obrigatório'
    }

    // Validação de valor do boleto
    if (!formData.bill_amount || parseFloat(formData.bill_amount) <= 0) {
      newErrors.bill_amount = 'Valor do boleto deve ser maior que zero'
    }

    // Validação de gastos (deve ser menor que o valor do boleto)
    if (formData.expenses && parseFloat(formData.expenses) >= parseFloat(formData.bill_amount)) {
      newErrors.expenses = 'Gastos devem ser menores que o valor do boleto'
    }

    // Validação de parcelas
    if (!formData.installments || parseInt(formData.installments) < 1) {
      newErrors.installments = 'Número de parcelas deve ser pelo menos 1'
    }

    // Validação de intervalo
    if (!formData.installment_interval || parseInt(formData.installment_interval) < 1) {
      newErrors.installment_interval = 'Intervalo deve ser pelo menos 1 dia'
    }

    // Validação de data de vencimento
    if (!formData.first_due_date) {
      newErrors.first_due_date = 'Data de vencimento é obrigatória'
    } else {
      const selectedDate = new Date(formData.first_due_date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (selectedDate < today) {
        newErrors.first_due_date = 'Data de vencimento não pode ser no passado'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCreateProfitSharing = async () => {
    try {
      setIsSubmitting(true)
      setErrors({})

      // Validar formulário
      if (!validateForm()) {
        setIsSubmitting(false)
        return
      }

      const profitSharingData = {
        ...formData,
        bill_amount: parseFloat(formData.bill_amount),
        expenses: parseFloat(formData.expenses) || 0,
        extras: parseFloat(formData.extras) || 0,
        installments: parseInt(formData.installments),
        installment_interval: parseInt(formData.installment_interval)
      }

      const newProfitSharing = await profitSharingAPI.create(profitSharingData)
      
      // Gerar parcelas automaticamente
      const partnerShare = ((profitSharingData.bill_amount - profitSharingData.expenses) / 2) + profitSharingData.extras
      await profitSharingAPI.generateInstallments(
        newProfitSharing.id,
        partnerShare,
        profitSharingData.installments,
        profitSharingData.installment_interval,
        profitSharingData.first_due_date
      )

      setShowCreateModal(false)
      setFormData({
        company_id: '',
        bill_id: '',
        company_name: '',
        bill_description: '',
        bill_amount: '',
        expenses: '',
        extras: '',
        installments: 1,
        installment_interval: 30,
        first_due_date: '',
        notes: ''
      })
      setSelectedCompany(null)
      setSelectedBill(null)
      setBills([])
      setErrors({})
      loadProfitSharings()
      loadStatistics()
    } catch (err) {
      console.error("Erro ao criar divisão de lucro:", err)
      setErrors({ submit: "Erro ao criar divisão de lucro. Verifique os dados e tente novamente." })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Estados para validação do modal de parcela
  const [installmentErrors, setInstallmentErrors] = useState({})
  const [isUpdatingInstallment, setIsUpdatingInstallment] = useState(false)

  // Função para validar formulário de parcela
  const validateInstallmentForm = () => {
    const newErrors = {}

    // Validação de status
    if (!selectedInstallment.status) {
      newErrors.status = 'Status é obrigatório'
    }

    // Validação de data de pagamento quando status é "Pago"
    if (selectedInstallment.status === 'paid') {
      if (!selectedInstallment.paid_date) {
        newErrors.paid_date = 'Data do pagamento é obrigatória quando status é "Pago"'
      } else {
        const paidDate = new Date(selectedInstallment.paid_date)
        const dueDate = new Date(selectedInstallment.due_date)
        
        if (paidDate > new Date()) {
          newErrors.paid_date = 'Data do pagamento não pode ser no futuro'
        }
      }
    }

    setInstallmentErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleUpdateInstallment = async () => {
    try {
      setIsUpdatingInstallment(true)
      setInstallmentErrors({})

      // Validar formulário
      if (!validateInstallmentForm()) {
        setIsUpdatingInstallment(false)
        return
      }

      await profitSharingAPI.updateInstallment(selectedInstallment.id, {
        status: selectedInstallment.status,
        paid_date: selectedInstallment.status === 'paid' ? selectedInstallment.paid_date : null,
        payment_notes: selectedInstallment.payment_notes
      })
      
      // Atualizar o estado local
      if (selectedProfitSharing) {
        const updatedInstallments = selectedProfitSharing.profit_sharing_installments?.map(installment => 
          installment.id === selectedInstallment.id 
            ? { ...installment, ...selectedInstallment }
            : installment
        )
        
        setSelectedProfitSharing({
          ...selectedProfitSharing,
          profit_sharing_installments: updatedInstallments
        })
      }
      
      setProfitSharings(prevProfitSharings => 
        prevProfitSharings.map(profitSharing => {
          if (profitSharing.id === selectedProfitSharing?.id) {
            return {
              ...profitSharing,
              profit_sharing_installments: profitSharing.profit_sharing_installments?.map(installment => 
                installment.id === selectedInstallment.id 
                  ? { ...installment, ...selectedInstallment }
                  : installment
              )
            }
          }
          return profitSharing
        })
      )
      
      setShowInstallmentModal(false)
      setSelectedInstallment(null)
      setInstallmentErrors({})
      loadStatistics()
    } catch (err) {
      console.error("Erro ao atualizar parcela:", err)
      setInstallmentErrors({ submit: "Erro ao atualizar parcela. Verifique os dados e tente novamente." })
    } finally {
      setIsUpdatingInstallment(false)
    }
  }

  const handleDeleteProfitSharing = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta divisão de lucro?")) {
      try {
        await profitSharingAPI.delete(id)
        loadProfitSharings()
        loadStatistics()
      } catch (err) {
        console.error("Erro ao deletar divisão de lucro:", err)
        alert("Erro ao deletar divisão de lucro. Tente novamente.")
      }
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getInstallmentStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleUpdateOverdueStatus = async () => {
    try {
      setLoading(true)
      const result = await profitSharingAPI.updateOverdueStatus()
      if (result.total > 0) {
        alert(`Status atualizado! ${result.total} pagamento(s) de sócio marcado(s) como vencido(s).`)
      } else {
        alert("Nenhum pagamento de sócio vencido encontrado.")
      }
      loadProfitSharings()
      loadStatistics()
    } catch (err) {
      console.error("Erro ao atualizar status de pagamentos vencidos:", err)
      alert("Erro ao atualizar status de pagamentos vencidos. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatCurrencyCompact = (value) => {
    const val = value || 0
    if (val >= 1000000) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        notation: 'compact',
        maximumFractionDigits: 1
      }).format(val)
    }
    return formatCurrency(val)
  }

  const filteredProfitSharings = profitSharings.filter(profitSharing => {
    const matchesSearch = profitSharing.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profitSharing.bill_description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || profitSharing.status === filterStatus
    
    return matchesSearch && matchesStatus
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
          <h2 className="text-3xl font-bold text-gray-900">Divisão de Lucros</h2>
          <p className="text-gray-600">Gerencie a divisão de lucros dos serviços com seu sócio</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Divisão
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Divisões</p>
                <p className="text-2xl font-bold text-blue-600">{profitSharings.length}</p>
              </div>
              <Calculator className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {profitSharings.filter(p => p.status === 'pending').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Em Andamento</p>
                <p className="text-2xl font-bold text-blue-600">
                  {profitSharings.filter(p => p.status === 'in_progress').length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Concluídas</p>
                <p className="text-2xl font-bold text-green-600">
                  {profitSharings.filter(p => p.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total a Pagar</p>
                <p className="text-xl font-bold text-red-600">{formatCurrencyCompact(statistics.totalToPay)}</p>
              </div>
              <CreditCard className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Pago</p>
                <p className="text-xl font-bold text-green-600">{formatCurrencyCompact(statistics.totalPaid)}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendente</p>
                <p className="text-xl font-bold text-yellow-600">{formatCurrencyCompact(statistics.totalPending)}</p>
              </div>
              <Timer className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Em Atraso</p>
                <p className="text-xl font-bold text-red-600">{formatCurrencyCompact(statistics.totalOverdue)}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Lucro Médio</p>
                <p className="text-xl font-bold text-purple-600">{formatCurrencyCompact(statistics.averageProfit)}</p>
              </div>
              <PiggyBank className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error Display */}
      {error && (
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Buscar</Label>
              <Input
                placeholder="Empresa ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
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
                  <SelectItem value="in_progress">Em Andamento</SelectItem>
                  <SelectItem value="completed">Concluída</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end space-x-2">
              <Button 
                variant="outline" 
                onClick={handleUpdateOverdueStatus}
                disabled={loading}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar Vencidos
              </Button>
              <Button variant="outline" onClick={loadProfitSharings}>
                <Filter className="h-4 w-4 mr-2" />
                Atualizar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profit Sharings List */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Carregando divisões de lucro...</p>
        </div>
      ) : filteredProfitSharings.length === 0 ? (
        <div className="text-center py-8">
          <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma divisão encontrada</h3>
          <p className="text-gray-600">
            {profitSharings.length === 0 ? 'Ainda não há divisões de lucro cadastradas' : 'Nenhuma divisão corresponde aos filtros aplicados'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredProfitSharings.map((profitSharing) => (
            <Card key={profitSharing.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{profitSharing.company_name}</h3>
                      <Badge className={getStatusColor(profitSharing.status)}>
                        {profitSharing.status === 'pending' ? 'Pendente' : 
                         profitSharing.status === 'in_progress' ? 'Em Andamento' : 'Concluída'}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{profitSharing.bill_description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-500">Valor do Boleto:</span>
                        <p className="font-semibold text-gray-900">{formatCurrency(profitSharing.bill_amount)}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-500">Gastos:</span>
                        <p className="font-semibold text-red-600">{formatCurrency(profitSharing.expenses)}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-500">Lucro:</span>
                        <p className="font-semibold text-green-600">{formatCurrency(profitSharing.profit)}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-500">Parte do Sócio:</span>
                        <p className="font-semibold text-blue-600">{formatCurrency(profitSharing.partner_share)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedProfitSharing(profitSharing)
                        setShowDetailsModal(true)
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteProfitSharing(profitSharing.id)}
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
       <AdminModal
         open={showCreateModal}
         onOpenChange={(open) => {
           setShowCreateModal(open)
           if (!open) {
             setErrors({})
             setFormData({
               company_id: '',
               bill_id: '',
               company_name: '',
               bill_description: '',
               bill_amount: '',
               expenses: '',
               extras: '',
               installments: 1,
               installment_interval: 30,
               first_due_date: '',
               notes: ''
             })
             setSelectedCompany(null)
             setSelectedBill(null)
             setBills([])
           }
         }}
         title="Nova Divisão de Lucro"
         description="Selecione a empresa, boleto e configure os gastos para calcular a divisão de lucro"
         type="create"
         size="2xl"
       >
         <div className="space-y-6">
                       {/* Mensagem de erro geral */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{errors.submit}</p>
              </div>
            )}

           <ModalSection title="Seleção de Empresa e Boleto">
             <ModalGrid cols={2}>
               <div>
                 <Label htmlFor="company" className="text-sm font-medium text-gray-700">Empresa *</Label>
                 <Select value={formData.company_id} onValueChange={handleCompanyChange}>
                   <SelectTrigger className={`mt-1 ${errors.company_id ? 'border-red-500 focus:border-red-500' : ''}`}>
                     <SelectValue placeholder="Selecione uma empresa" />
                   </SelectTrigger>
                   <SelectContent>
                     {companies.map((company) => (
                       <SelectItem key={company.id} value={company.id}>
                         {company.name}
                       </SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
                 {errors.company_id && (
                   <p className="text-red-600 text-xs mt-1">{errors.company_id}</p>
                 )}
               </div>
               
               <div>
                 <Label htmlFor="bill" className="text-sm font-medium text-gray-700">Boleto *</Label>
                 <Select 
                   value={formData.bill_id} 
                   onValueChange={handleBillChange}
                   disabled={!selectedCompany}
                 >
                   <SelectTrigger className={`mt-1 ${errors.bill_id ? 'border-red-500 focus:border-red-500' : ''}`}>
                     <SelectValue placeholder={selectedCompany ? "Selecione um boleto" : "Selecione uma empresa primeiro"} />
                   </SelectTrigger>
                   <SelectContent>
                     {bills.map((bill) => (
                       <SelectItem key={bill.id} value={bill.id}>
                         {bill.description} - {formatCurrency(bill.total_amount)}
                       </SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
                 {errors.bill_id && (
                   <p className="text-red-600 text-xs mt-1">{errors.bill_id}</p>
                 )}
               </div>
             </ModalGrid>
           </ModalSection>
          
          {selectedBill && (
            <>
                             <ModalSection title="Configuração Financeira">
                 <ModalGrid cols={3}>
                   <div>
                     <Label htmlFor="bill_amount" className="text-sm font-medium text-gray-700">Valor do Boleto *</Label>
                     <Input
                       id="bill_amount"
                       type="number"
                       step="0.01"
                       value={formData.bill_amount}
                       onChange={(e) => setFormData({...formData, bill_amount: e.target.value})}
                       placeholder="0.00"
                       className={`mt-1 ${errors.bill_amount ? 'border-red-500 focus:border-red-500' : ''}`}
                     />
                     {errors.bill_amount && (
                       <p className="text-red-600 text-xs mt-1">{errors.bill_amount}</p>
                     )}
                   </div>
                   
                   <div>
                     <Label htmlFor="expenses" className="text-sm font-medium text-gray-700">Gastos do Serviço</Label>
                     <Input
                       id="expenses"
                       type="number"
                       step="0.01"
                       value={formData.expenses}
                       onChange={(e) => setFormData({...formData, expenses: e.target.value})}
                       placeholder="0.00"
                       className={`mt-1 ${errors.expenses ? 'border-red-500 focus:border-red-500' : ''}`}
                     />
                     {errors.expenses && (
                       <p className="text-red-600 text-xs mt-1">{errors.expenses}</p>
                     )}
                   </div>
                   
                   <div>
                     <Label htmlFor="extras" className="text-sm font-medium text-gray-700">Extras (não divididos)</Label>
                     <Input
                       id="extras"
                       type="number"
                       step="0.01"
                       value={formData.extras}
                       onChange={(e) => setFormData({...formData, extras: e.target.value})}
                       placeholder="0.00"
                       className="mt-1"
                     />
                   </div>
                 </ModalGrid>
                
                {/* Cálculo da Divisão */}
                <div className="bg-gray-50 rounded-lg p-4 mt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Cálculo da Divisão</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-green-700 block mb-1">Lucro</span>
                      <p className="text-lg font-bold text-green-600">
                        {formatCurrency(calculateProfit())}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-blue-700 block mb-1">Parte do Sócio (50% + extras)</span>
                      <p className="text-lg font-bold text-blue-600">
                        {formatCurrency(calculatePartnerShare())}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm font-medium text-purple-700 block mb-1">Sua Parte (50%)</span>
                      <p className="text-lg font-bold text-purple-600">
                        {formatCurrency(calculateMyShare())}
                      </p>
                    </div>
                  </div>
                </div>
              </ModalSection>
              
                             <ModalSection title="Configuração de Parcelas">
                 <ModalGrid cols={3}>
                   <div>
                     <Label htmlFor="installments" className="text-sm font-medium text-gray-700">Parcelas para Pagamento *</Label>
                     <Input
                       id="installments"
                       type="number"
                       min="1"
                       value={formData.installments}
                       onChange={(e) => setFormData({...formData, installments: e.target.value})}
                       className={`mt-1 ${errors.installments ? 'border-red-500 focus:border-red-500' : ''}`}
                     />
                     {errors.installments && (
                       <p className="text-red-600 text-xs mt-1">{errors.installments}</p>
                     )}
                   </div>
                   
                   <div>
                     <Label htmlFor="installment_interval" className="text-sm font-medium text-gray-700">Intervalo (dias) *</Label>
                     <Input
                       id="installment_interval"
                       type="number"
                       min="1"
                       value={formData.installment_interval}
                       onChange={(e) => setFormData({...formData, installment_interval: e.target.value})}
                       className={`mt-1 ${errors.installment_interval ? 'border-red-500 focus:border-red-500' : ''}`}
                     />
                     {errors.installment_interval && (
                       <p className="text-red-600 text-xs mt-1">{errors.installment_interval}</p>
                     )}
                   </div>
                   
                   <div>
                     <Label htmlFor="first_due_date" className="text-sm font-medium text-gray-700">Primeiro Vencimento *</Label>
                     <Input
                       id="first_due_date"
                       type="date"
                       value={formData.first_due_date}
                       onChange={(e) => setFormData({...formData, first_due_date: e.target.value})}
                       className={`mt-1 ${errors.first_due_date ? 'border-red-500 focus:border-red-500' : ''}`}
                     />
                     {errors.first_due_date && (
                       <p className="text-red-600 text-xs mt-1">{errors.first_due_date}</p>
                     )}
                   </div>
                 </ModalGrid>
                
                <div>
                  <Label htmlFor="notes" className="text-sm font-medium text-gray-700">Observações</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Observações sobre esta divisão..."
                    rows={3}
                    className="mt-1"
                  />
                </div>
              </ModalSection>
            </>
          )}
          
                     <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
             <ModalActionButton
               onClick={() => {
                 setShowCreateModal(false)
                 setErrors({})
               }}
               variant="outline"
               disabled={isSubmitting}
             >
               Cancelar
             </ModalActionButton>
             <ModalActionButton
               onClick={handleCreateProfitSharing}
               disabled={isSubmitting || !selectedBill || !formData.first_due_date}
               variant="success"
               icon={isSubmitting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Calculator className="h-4 w-4" />}
             >
               {isSubmitting ? 'Criando...' : 'Criar Divisão'}
             </ModalActionButton>
           </div>
        </div>
      </AdminModal>

      {/* Details Modal */}
      <AdminModal
        open={showDetailsModal}
        onOpenChange={setShowDetailsModal}
        title="Detalhes da Divisão de Lucro"
        description="Visualize todos os detalhes e gerencie os pagamentos ao sócio"
        type="view"
        size="2xl"
      >
        {selectedProfitSharing && (
          <div className="space-y-6">
            <ModalSection title="Informações Básicas">
              <ModalGrid cols={2}>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Empresa</Label>
                  <p className="text-gray-900 mt-1">{selectedProfitSharing.company_name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Status</Label>
                  <div className="mt-1">
                    <Badge className={getStatusColor(selectedProfitSharing.status)}>
                      {selectedProfitSharing.status === 'pending' ? 'Pendente' : 
                       selectedProfitSharing.status === 'in_progress' ? 'Em Andamento' : 'Concluída'}
                    </Badge>
                  </div>
                </div>
                <div className="col-span-2">
                  <Label className="text-sm font-medium text-gray-700">Descrição do Boleto</Label>
                  <p className="text-gray-900 mt-1">{selectedProfitSharing.bill_description}</p>
                </div>
              </ModalGrid>
            </ModalSection>
            
            <ModalSection title="Cálculo Financeiro">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-700">Valor do Boleto</p>
                  <p className="text-lg font-bold text-blue-600 mt-1">
                    {formatCurrency(selectedProfitSharing.bill_amount)}
                  </p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <p className="text-sm font-medium text-red-700">Gastos</p>
                  <p className="text-lg font-bold text-red-600 mt-1">
                    {formatCurrency(selectedProfitSharing.expenses)}
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-700">Lucro</p>
                  <p className="text-lg font-bold text-green-600 mt-1">
                    {formatCurrency(selectedProfitSharing.profit)}
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm font-medium text-purple-700">Parte do Sócio</p>
                  <p className="text-lg font-bold text-purple-600 mt-1">
                    {formatCurrency(selectedProfitSharing.partner_share)}
                  </p>
                </div>
              </div>
            </ModalSection>
            
            <ModalSection title="Parcelas para Pagamento do Sócio">
              {selectedProfitSharing.profit_sharing_installments?.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma parcela encontrada</h3>
                  <p className="text-gray-600">Esta divisão ainda não possui parcelas cadastradas.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedProfitSharing.profit_sharing_installments?.map((installment) => (
                    <div key={installment.id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div>
                          <span className="font-medium text-gray-900">Parcela {installment.installment_number}</span>
                          <p className="text-sm text-gray-600">
                            Vencimento: {new Date(installment.due_date).toLocaleDateString('pt-BR')}
                          </p>
                          {installment.paid_date && (
                            <p className="text-sm text-green-600">
                              Pago em: {new Date(installment.paid_date).toLocaleDateString('pt-BR')}
                            </p>
                          )}
                        </div>
                        <div>
                          <span className="font-semibold text-gray-900">{formatCurrency(installment.amount)}</span>
                        </div>
                        <Badge className={getInstallmentStatusColor(installment.status)}>
                          {installment.status === 'paid' ? 'Pago' : 
                           installment.status === 'pending' ? 'Pendente' : 'Vencido'}
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
              )}
            </ModalSection>
            
            {selectedProfitSharing.notes && (
              <ModalSection title="Observações">
                <p className="text-gray-900">{selectedProfitSharing.notes}</p>
              </ModalSection>
            )}
          </div>
        )}
      </AdminModal>

             {/* Installment Modal */}
       <AdminModal
         open={showInstallmentModal}
         onOpenChange={(open) => {
           setShowInstallmentModal(open)
           if (!open) {
             setInstallmentErrors({})
             setSelectedInstallment(null)
           }
         }}
         title="Gerenciar Parcela"
         description="Atualize o status da parcela e adicione observações"
         type="edit"
         size="2xl"
       >
         {selectedInstallment && (
           <div className="space-y-6">
                           {/* Mensagem de erro geral */}
              {installmentErrors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600 text-sm">{installmentErrors.submit}</p>
                </div>
              )}

             <ModalSection title="Informações da Parcela">
               <div>
                 <Label className="text-sm font-medium text-gray-700">Parcela {selectedInstallment.installment_number}</Label>
                 <p className="text-gray-600 mt-1">
                   Valor: {formatCurrency(selectedInstallment.amount)} - 
                   Vencimento: {new Date(selectedInstallment.due_date).toLocaleDateString('pt-BR')}
                 </p>
               </div>
             </ModalSection>
             
             <ModalSection title="Status do Pagamento">
               <div>
                 <Label htmlFor="status" className="text-sm font-medium text-gray-700">Status *</Label>
                 <Select 
                   value={selectedInstallment.status} 
                   onValueChange={(value) => setSelectedInstallment({...selectedInstallment, status: value})}
                 >
                   <SelectTrigger className={`mt-1 ${installmentErrors.status ? 'border-red-500 focus:border-red-500' : ''}`}>
                     <SelectValue />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="pending">Pendente</SelectItem>
                     <SelectItem value="paid">Pago</SelectItem>
                     <SelectItem value="overdue">Vencido</SelectItem>
                   </SelectContent>
                 </Select>
                 {installmentErrors.status && (
                   <p className="text-red-600 text-xs mt-1">{installmentErrors.status}</p>
                 )}
               </div>
               
               {/* Data de Pagamento - aparece apenas quando status é "Pago" */}
               {selectedInstallment.status === 'paid' && (
                 <div className="mt-4">
                   <Label htmlFor="paid_date" className="text-sm font-medium text-gray-700">Data do Pagamento *</Label>
                   <Input
                     id="paid_date"
                     type="date"
                     value={selectedInstallment.paid_date || new Date().toISOString().split('T')[0]}
                     onChange={(e) => setSelectedInstallment({...selectedInstallment, paid_date: e.target.value})}
                     className={`mt-1 ${installmentErrors.paid_date ? 'border-red-500 focus:border-red-500' : ''}`}
                   />
                   {installmentErrors.paid_date && (
                     <p className="text-red-600 text-xs mt-1">{installmentErrors.paid_date}</p>
                   )}
                   <p className="text-xs text-gray-500 mt-1">
                     Selecione a data em que o pagamento foi realizado
                   </p>
                 </div>
               )}
             </ModalSection>
             
             <ModalSection title="Observações">
               <div>
                 <Label htmlFor="payment_notes" className="text-sm font-medium text-gray-700">Observações do Pagamento</Label>
                 <Textarea
                   id="payment_notes"
                   value={selectedInstallment.payment_notes || ''}
                   onChange={(e) => setSelectedInstallment({...selectedInstallment, payment_notes: e.target.value})}
                   placeholder="Observações sobre o pagamento..."
                   rows={3}
                   className="mt-1"
                 />
               </div>
             </ModalSection>
             
             <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
               <ModalActionButton
                 onClick={() => {
                   setShowInstallmentModal(false)
                   setInstallmentErrors({})
                 }}
                 variant="outline"
                 disabled={isUpdatingInstallment}
               >
                 Cancelar
               </ModalActionButton>
               <ModalActionButton
                 onClick={handleUpdateInstallment}
                 disabled={isUpdatingInstallment}
                 variant="primary"
                 icon={isUpdatingInstallment ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
               >
                 {isUpdatingInstallment ? 'Salvando...' : 'Salvar Alterações'}
               </ModalActionButton>
             </div>
           </div>
         )}
       </AdminModal>
      </div>
    )
  }
  
  export default ProfitSharingManager