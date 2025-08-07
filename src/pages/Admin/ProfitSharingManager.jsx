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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
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

  const handleCreateProfitSharing = async () => {
    try {
      // Validações básicas
      if (!formData.company_id) {
        alert("Empresa é obrigatória.")
        return
      }
      
      if (!formData.bill_id) {
        alert("Boleto é obrigatório.")
        return
      }
      
      if (!formData.first_due_date) {
        alert("Data de vencimento é obrigatória.")
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
      loadProfitSharings()
      loadStatistics()
    } catch (err) {
      console.error("Erro ao criar divisão de lucro:", err)
      alert("Erro ao criar divisão de lucro. Tente novamente.")
    }
  }

  const handleUpdateInstallment = async () => {
    try {
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
      loadStatistics()
    } catch (err) {
      console.error("Erro ao atualizar parcela:", err)
      alert("Erro ao atualizar parcela. Tente novamente.")
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
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Nova Divisão de Lucro</DialogTitle>
            <DialogDescription>
              Selecione a empresa, boleto e configure os gastos para calcular a divisão de lucro.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Empresa *</Label>
                <Select value={formData.company_id} onValueChange={handleCompanyChange}>
                  <SelectTrigger>
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
              </div>
              
              <div>
                <Label>Boleto *</Label>
                <Select 
                  value={formData.bill_id} 
                  onValueChange={handleBillChange}
                  disabled={!selectedCompany}
                >
                  <SelectTrigger>
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
              </div>
            </div>
            
            {selectedBill && (
              <>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Valor do Boleto</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.bill_amount}
                      onChange={(e) => setFormData({...formData, bill_amount: e.target.value})}
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div>
                    <Label>Gastos do Serviço</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.expenses}
                      onChange={(e) => setFormData({...formData, expenses: e.target.value})}
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div>
                    <Label>Extras (não divididos)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.extras}
                      onChange={(e) => setFormData({...formData, extras: e.target.value})}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <Card className="bg-blue-50">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-lg mb-3">Cálculo da Divisão</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Lucro:</span>
                        <p className="text-lg font-bold text-green-600">
                          {formatCurrency(calculateProfit())}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Parte do Sócio (50% + extras):</span>
                        <p className="text-lg font-bold text-blue-600">
                          {formatCurrency(calculatePartnerShare())}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Sua Parte (50%):</span>
                        <p className="text-lg font-bold text-purple-600">
                          {formatCurrency(calculateMyShare())}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Parcelas para Pagamento</Label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.installments}
                      onChange={(e) => setFormData({...formData, installments: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label>Intervalo (dias)</Label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.installment_interval}
                      onChange={(e) => setFormData({...formData, installment_interval: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label>Primeiro Vencimento *</Label>
                    <Input
                      type="date"
                      value={formData.first_due_date}
                      onChange={(e) => setFormData({...formData, first_due_date: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Observações</Label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Observações sobre esta divisão..."
                    rows={3}
                  />
                </div>
              </>
            )}
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleCreateProfitSharing}
              disabled={!selectedBill || !formData.first_due_date}
            >
              Criar Divisão
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Divisão de Lucro</DialogTitle>
            <DialogDescription>
              Visualize todos os detalhes e gerencie os pagamentos ao sócio.
            </DialogDescription>
          </DialogHeader>
          
          {selectedProfitSharing && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Empresa</Label>
                  <p className="text-gray-900">{selectedProfitSharing.company_name}</p>
                </div>
                <div>
                  <Label className="font-semibold">Status</Label>
                  <Badge className={getStatusColor(selectedProfitSharing.status)}>
                    {selectedProfitSharing.status === 'pending' ? 'Pendente' : 
                     selectedProfitSharing.status === 'in_progress' ? 'Em Andamento' : 'Concluída'}
                  </Badge>
                </div>
                <div className="col-span-2">
                  <Label className="font-semibold">Descrição do Boleto</Label>
                  <p className="text-gray-900">{selectedProfitSharing.bill_description}</p>
                </div>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Cálculo Financeiro</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Valor do Boleto</p>
                      <p className="text-lg font-bold text-blue-600">
                        {formatCurrency(selectedProfitSharing.bill_amount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Gastos</p>
                      <p className="text-lg font-bold text-red-600">
                        {formatCurrency(selectedProfitSharing.expenses)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Lucro</p>
                      <p className="text-lg font-bold text-green-600">
                        {formatCurrency(selectedProfitSharing.profit)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Parte do Sócio</p>
                      <p className="text-lg font-bold text-purple-600">
                        {formatCurrency(selectedProfitSharing.partner_share)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div>
                <h4 className="font-semibold text-lg mb-4">Parcelas para Pagamento do Sócio</h4>
                {selectedProfitSharing.profit_sharing_installments?.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma parcela encontrada</h3>
                    <p className="text-gray-600">Esta divisão ainda não possui parcelas cadastradas.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedProfitSharing.profit_sharing_installments?.map((installment) => (
                      <div key={installment.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div>
                            <span className="font-medium">Parcela {installment.installment_number}</span>
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
                            <span className="font-semibold">{formatCurrency(installment.amount)}</span>
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
              </div>
              
              {selectedProfitSharing.notes && (
                <div>
                  <Label className="font-semibold">Observações</Label>
                  <p className="text-gray-900 mt-1">{selectedProfitSharing.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Installment Modal */}
      <Dialog open={showInstallmentModal} onOpenChange={setShowInstallmentModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gerenciar Parcela</DialogTitle>
            <DialogDescription>
              Atualize o status da parcela e adicione observações.
            </DialogDescription>
          </DialogHeader>
          
          {selectedInstallment && (
            <div className="space-y-4">
              <div>
                <Label className="font-semibold">Parcela {selectedInstallment.installment_number}</Label>
                <p className="text-gray-600">
                  Valor: {formatCurrency(selectedInstallment.amount)} - 
                  Vencimento: {new Date(selectedInstallment.due_date).toLocaleDateString('pt-BR')}
                </p>
              </div>
              
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
                  </SelectContent>
                </Select>
              </div>
              
              {/* Data de Pagamento - aparece apenas quando status é "Pago" */}
              {selectedInstallment.status === 'paid' && (
                <div>
                  <Label>Data do Pagamento</Label>
                  <Input
                    type="date"
                    value={selectedInstallment.paid_date || new Date().toISOString().split('T')[0]}
                    onChange={(e) => setSelectedInstallment({...selectedInstallment, paid_date: e.target.value})}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Selecione a data em que o pagamento foi realizado
                  </p>
                </div>
              )}
              
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

export default ProfitSharingManager