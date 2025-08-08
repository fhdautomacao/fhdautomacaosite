import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  RefreshCw,
  Loader2,
  Info,
  Save
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import AdminDialog from '@/components/admin/AdminDialog'
import AdminSelect from '@/components/admin/AdminSelect'
import { profitSharingAPI } from '@/api/profitSharing'
import { companiesAPI } from '@/api/companies'
import { billsAPI } from '@/api/bills'
import { useAuth } from '@/contexts/AuthContext'

export default function ProfitSharingManagerRefactored() {
  const { userPermissions } = useAuth()
  const [profitSharings, setProfitSharings] = useState([])
  const [companies, setCompanies] = useState([])
  const [bills, setBills] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  
  // Estados de modais
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showInstallmentModal, setShowInstallmentModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  
  // Estados de seleção
  const [selectedProfitSharing, setSelectedProfitSharing] = useState(null)
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [selectedBill, setSelectedBill] = useState(null)
  const [selectedInstallment, setSelectedInstallment] = useState(null)
  const [profitSharingToDelete, setProfitSharingToDelete] = useState(null)
  
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

  const [installmentFormData, setInstallmentFormData] = useState({
    due_date: '',
    amount: '',
    status: 'pending',
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
    } catch (error) {
      console.error("Erro ao carregar divisão de lucros:", error)
      setError("Erro ao carregar divisão de lucros")
    } finally {
      setLoading(false)
    }
  }

  const loadCompanies = async () => {
    try {
      const data = await companiesAPI.getAll()
      setCompanies(data)
    } catch (error) {
      console.error("Erro ao carregar empresas:", error)
    }
  }

  const loadStatistics = async () => {
    try {
      const stats = await profitSharingAPI.getStatistics()
      setStatistics(stats)
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error)
    }
  }

  const loadBillsByCompany = async (companyId) => {
    try {
      const data = await billsAPI.getByCompany(companyId)
      setBills(data)
    } catch (error) {
      console.error("Erro ao carregar boletos:", error)
      setBills([])
    }
  }

  const handleCompanyChange = (companyId) => {
    setFormData({
      ...formData,
      company_id: companyId,
      company_name: companies.find(c => c.id === companyId)?.name || '',
      bill_id: '',
      bill_description: '',
      bill_amount: ''
    })
    setSelectedCompany(companies.find(c => c.id === companyId))
    if (companyId) {
      loadBillsByCompany(companyId)
    } else {
      setBills([])
    }
  }

  const handleBillChange = (billId) => {
    const bill = bills.find(b => b.id === billId)
    setFormData({
      ...formData,
      bill_id: billId,
      bill_description: bill?.description || '',
      bill_amount: bill?.total_amount || ''
    })
    setSelectedBill(bill)
  }

  const calculateProfit = () => {
    const billAmount = parseFloat(formData.bill_amount.replace(/[^\d,]/g, '').replace(',', '.')) || 0
    const expenses = parseFloat(formData.expenses.replace(/[^\d,]/g, '').replace(',', '.')) || 0
    const extras = parseFloat(formData.extras.replace(/[^\d,]/g, '').replace(',', '.')) || 0
    return billAmount - expenses - extras
  }

  const calculatePartnerShare = () => {
    const profit = calculateProfit()
    return profit * 0.5 // 50% para o parceiro
  }

  const calculateMyShare = () => {
    const profit = calculateProfit()
    return profit * 0.5 // 50% para mim
  }

  const handleCreateProfitSharing = async () => {
    if (!formData.company_id || !formData.bill_id || !formData.first_due_date) {
      setError("Preencha todos os campos obrigatórios")
      return
    }

    try {
      setLoading(true)
      const profit = calculateProfit()
      const partnerShare = calculatePartnerShare()
      const myShare = calculateMyShare()

      const profitSharingData = {
        company_id: formData.company_id,
        bill_id: formData.bill_id,
        company_name: formData.company_name,
        bill_description: formData.bill_description,
        bill_amount: formData.bill_amount,
        expenses: formData.expenses || '0',
        extras: formData.extras || '0',
        total_profit: profit,
        partner_share: partnerShare,
        my_share: myShare,
        installments: formData.installments,
        installment_interval: formData.installment_interval,
        first_due_date: formData.first_due_date,
        notes: formData.notes,
        status: 'pending'
      }

      await profitSharingAPI.create(profitSharingData)
      await loadProfitSharings()
      resetForm()
      setShowCreateModal(false)
    } catch (error) {
      console.error("Erro ao criar divisão de lucros:", error)
      setError("Erro ao criar divisão de lucros")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateInstallment = async () => {
    if (!selectedInstallment || !installmentFormData.due_date || !installmentFormData.amount) {
      setError("Preencha todos os campos obrigatórios")
      return
    }

    try {
      setLoading(true)
      await profitSharingAPI.updateInstallment(selectedInstallment.id, installmentFormData)
      await loadProfitSharings()
      setShowInstallmentModal(false)
      setSelectedInstallment(null)
      setInstallmentFormData({
        due_date: '',
        amount: '',
        status: 'pending',
        notes: ''
      })
    } catch (error) {
      console.error("Erro ao atualizar parcela:", error)
      setError("Erro ao atualizar parcela")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProfitSharing = async () => {
    if (!profitSharingToDelete) return

    try {
      setLoading(true)
      await profitSharingAPI.delete(profitSharingToDelete.id)
      await loadProfitSharings()
      setShowDeleteModal(false)
      setProfitSharingToDelete(null)
    } catch (error) {
      console.error("Erro ao deletar divisão de lucros:", error)
      setError("Erro ao deletar divisão de lucros")
    } finally {
      setLoading(false)
    }
  }

  const openCreateModal = () => {
    resetForm()
    setShowCreateModal(true)
  }

  const openEditModal = (profitSharing) => {
    setSelectedProfitSharing(profitSharing)
    setFormData({
      company_id: profitSharing.company_id,
      bill_id: profitSharing.bill_id,
      company_name: profitSharing.company_name,
      bill_description: profitSharing.bill_description,
      bill_amount: profitSharing.bill_amount,
      expenses: profitSharing.expenses,
      extras: profitSharing.extras,
      installments: profitSharing.installments,
      installment_interval: profitSharing.installment_interval,
      first_due_date: profitSharing.first_due_date,
      notes: profitSharing.notes
    })
    setShowEditModal(true)
  }

  const openDetailsModal = (profitSharing) => {
    setSelectedProfitSharing(profitSharing)
    setShowDetailsModal(true)
  }

  const openInstallmentModal = (installment) => {
    setSelectedInstallment(installment)
    setInstallmentFormData({
      due_date: installment.due_date,
      amount: installment.amount,
      status: installment.status,
      notes: installment.notes || ''
    })
    setShowInstallmentModal(true)
  }

  const openDeleteModal = (profitSharing) => {
    setProfitSharingToDelete(profitSharing)
    setShowDeleteModal(true)
  }

  const resetForm = () => {
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'overdue': return 'bg-red-100 text-red-800'
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

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0)
  }

  const formatCurrencyCompact = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      notation: 'compact'
    }).format(value || 0)
  }

  const companyOptions = useMemo(() => {
    return companies.map(c => ({ value: c.id, label: c.name }))
  }, [companies])

  const billOptions = useMemo(() => {
    return bills.map(b => ({ value: b.id, label: `${b.description} - ${formatCurrency(b.total_amount)}` }))
  }, [bills])

  const statusOptions = [
    { value: 'all', label: 'Todos os status' },
    { value: 'pending', label: 'Pendente' },
    { value: 'paid', label: 'Pago' },
    { value: 'overdue', label: 'Vencido' }
  ]

  const filteredProfitSharings = profitSharings.filter(item => {
    const matchesSearch = item.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.bill_description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus
    return matchesSearch && matchesStatus
  })

  if (loading && profitSharings.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Divisão de Lucros</h1>
          <p className="text-gray-600">Gerencie a divisão de lucros entre parceiros</p>
        </div>
        <Button onClick={openCreateModal} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nova Divisão
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Total a Pagar</p>
                <p className="text-lg font-semibold">{formatCurrency(statistics.totalToPay)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total Pago</p>
                <p className="text-lg font-semibold">{formatCurrency(statistics.totalPaid)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">Pendente</p>
                <p className="text-lg font-semibold">{formatCurrency(statistics.totalPending)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Vencido</p>
                <p className="text-lg font-semibold">{formatCurrency(statistics.totalOverdue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar divisões..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div>
              <AdminSelect
                value={filterStatus}
                onChange={setFilterStatus}
                options={statusOptions}
                placeholder="Filtrar por status"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <PiggyBank className="h-4 w-4" />
              {filteredProfitSharings.length} divisão{filteredProfitSharings.length !== 1 ? 'ões' : ''} encontrada{filteredProfitSharings.length !== 1 ? 's' : ''}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Divisões */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredProfitSharings.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Building className="h-5 w-5 text-blue-500" />
                        <h3 className="text-lg font-semibold">{item.company_name}</h3>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status === 'paid' ? 'Pago' : item.status === 'pending' ? 'Pendente' : 'Vencido'}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{item.bill_description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Valor do Boleto:</span>
                          <p className="font-medium">{formatCurrency(item.bill_amount)}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Meu Lucro:</span>
                          <p className="font-medium text-green-600">{formatCurrency(item.my_share)}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Parcela do Parceiro:</span>
                          <p className="font-medium text-blue-600">{formatCurrency(item.partner_share)}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Parcelas:</span>
                          <p className="font-medium">{item.installments}x</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDetailsModal(item)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(item)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteModal(item)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modal de Criação */}
      <AdminDialog 
        open={showCreateModal} 
        onOpenChange={setShowCreateModal} 
        title="Nova Divisão de Lucros" 
        description="Crie uma nova divisão de lucros entre parceiros."
        className="max-w-3xl"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Empresa *</Label>
              <AdminSelect
                value={formData.company_id}
                onChange={handleCompanyChange}
                options={companyOptions}
                placeholder="Selecione uma empresa"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Boleto *</Label>
              <AdminSelect
                value={formData.bill_id}
                onChange={handleBillChange}
                options={billOptions}
                placeholder="Selecione um boleto"
                isDisabled={!formData.company_id}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Valor do Boleto</Label>
              <Input
                value={formData.bill_amount}
                onChange={(e) => setFormData({...formData, bill_amount: e.target.value})}
                placeholder="R$ 0,00"
                disabled
              />
            </div>
            <div className="space-y-1.5">
              <Label>Despesas</Label>
              <Input
                value={formData.expenses}
                onChange={(e) => setFormData({...formData, expenses: e.target.value})}
                placeholder="R$ 0,00"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Extras</Label>
              <Input
                value={formData.extras}
                onChange={(e) => setFormData({...formData, extras: e.target.value})}
                placeholder="R$ 0,00"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Número de Parcelas</Label>
              <Input
                type="number"
                value={formData.installments}
                onChange={(e) => setFormData({...formData, installments: parseInt(e.target.value)})}
                min="1"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Intervalo (dias)</Label>
              <Input
                type="number"
                value={formData.installment_interval}
                onChange={(e) => setFormData({...formData, installment_interval: parseInt(e.target.value)})}
                min="1"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Primeira Data de Vencimento *</Label>
              <Input
                type="date"
                value={formData.first_due_date}
                onChange={(e) => setFormData({...formData, first_due_date: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Observações</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Observações sobre a divisão..."
              rows={3}
            />
          </div>

          {/* Resumo dos Cálculos */}
          {formData.bill_amount && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium mb-2">Resumo dos Cálculos:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Lucro Total:</span>
                  <p className="font-medium text-green-600">{formatCurrency(calculateProfit())}</p>
                </div>
                <div>
                  <span className="text-gray-600">Minha Parte (50%):</span>
                  <p className="font-medium text-blue-600">{formatCurrency(calculateMyShare())}</p>
                </div>
                <div>
                  <span className="text-gray-600">Parte do Parceiro (50%):</span>
                  <p className="font-medium text-purple-600">{formatCurrency(calculatePartnerShare())}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateProfitSharing} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Criar Divisão
            </Button>
          </div>
        </div>
      </AdminDialog>

      {/* Modal de Confirmação de Exclusão */}
      <AdminDialog 
        open={showDeleteModal} 
        onOpenChange={setShowDeleteModal} 
        title="Confirmar Exclusão" 
        description="Tem certeza que deseja excluir esta divisão de lucros? Esta ação não pode ser desfeita."
        className="max-w-md"
      >
        <div className="space-y-4">
          {profitSharingToDelete && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800">
                <Info className="h-4 w-4" />
                <span className="font-medium">Empresa: {profitSharingToDelete.company_name}</span>
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleDeleteProfitSharing} disabled={loading} variant="destructive">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Excluir Divisão
            </Button>
          </div>
        </div>
      </AdminDialog>
    </div>
  )
}
