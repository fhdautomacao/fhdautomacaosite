import React, { useState, useEffect } from 'react'
import { Plus, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { billsAPI } from '@/api/bills'
import { companiesAPI } from '@/api/companies'
import BillsStatistics from '@/components/Bills/BillsStatistics'
import BillsFilters from '@/components/Bills/BillsFilters'
import BillsTable from '@/components/Bills/BillsTable'
import CreateBillModal from '@/components/Bills/CreateBillModal'
import EditBillModal from '@/components/Bills/EditBillModal'
import ViewBillModal from '@/components/Bills/ViewBillModal'
import InstallmentModal from '@/components/Bills/InstallmentModal'

// Utilitário: converte "R$ 1.234,56" -> 1234.56 (number)
function parseBRLToNumber(value) {
  if (value == null) return 0
  const str = String(value)
    .replace(/\s/g, '')
    .replace(/R\$/g, '')
    .replace(/\./g, '')
    .replace(',', '.')
  const n = parseFloat(str)
  return isNaN(n) ? 0 : n
}

export default function BillsManager() {
  // Estados principais
  const [bills, setBills] = useState([])
  const [loading, setLoading] = useState(true)
  const [companies, setCompanies] = useState([])
  
  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [companyFilter, setCompanyFilter] = useState('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  
  // Estados de modais
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showInstallmentModal, setShowInstallmentModal] = useState(false)
  
  // Estados de seleção
  const [selectedBill, setSelectedBill] = useState(null)
  const [selectedInstallment, setSelectedInstallment] = useState(null)
  
  // Estados de formulário
  const [formData, setFormData] = useState({
    company_id: '',
    company_name: '',
    total_amount: '',
    installments: 1,
    installment_interval: 30,
    first_due_date: '',
    description: '',
    type: 'receivable',
    admin_notes: ''
  })

  // Estados para redirecionamento
  const [returnToCompanyId, setReturnToCompanyId] = useState(null)
  const [returnBillId, setReturnBillId] = useState(null)

  // Carregar dados iniciais
  useEffect(() => {
    loadBills()
    loadCompanies()
  }, [])

  // Abrir boleto específico via query param
  useEffect(() => {
    const openByParam = async () => {
      const params = new URLSearchParams(window.location.search)
      const billId = params.get('billId')
      const open = params.get('open')
      if (open && open !== 'bills') return
      if (!billId) return
      
      const origin = params.get('origin')
      const companyId = params.get('companyId')
      
      try {
        if (bills.length === 0) {
          const data = await billsAPI.getAll()
          setBills(data)
          const found = data.find(b => String(b.id) === String(billId))
          if (found) {
            setSelectedBill(found)
            setShowDetailsModal(true)
          }
        } else {
          const found = bills.find(b => String(b.id) === String(billId))
          if (found) {
            setSelectedBill(found)
            setShowDetailsModal(true)
          }
        }
        
        if (origin === 'company' && companyId) {
          setReturnToCompanyId(companyId)
          setReturnBillId(billId)
        }
      } catch {}
    }
    openByParam()
  }, [bills])

  // Redirecionar ao fechar modal quando há origem company
  useEffect(() => {
    if (returnToCompanyId && !showDetailsModal) {
      const extra = returnBillId ? `&billId=${returnBillId}` : ''
      window.location.href = `/admin-fhd?open=companies&companyId=${returnToCompanyId}${extra}`
    }
  }, [showDetailsModal, returnToCompanyId])

  // Funções de carregamento
  const loadBills = async () => {
    try {
      setLoading(true)
      const data = await billsAPI.getAll()
      setBills(data)
      console.log('Boletos carregados:', data.length, 'registros')
    } catch (error) {
      console.error('Erro ao carregar boletos:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadCompanies = async () => {
    try {
      const data = await companiesAPI.getActive()
      setCompanies(data)
    } catch (error) {
      console.error('Erro ao carregar empresas:', error)
    }
  }

  // Funções de manipulação
  const handleCompanyChange = (companyId) => {
    const company = companies.find(c => c.id === companyId)
    setFormData({
      ...formData,
      company_id: companyId,
      company_name: company?.name || ''
    })
  }

  const handleCreateBill = async () => {
    try {
      const totalAmountNumber = parseBRLToNumber(formData.total_amount)

      // Validações
      if (!formData.company_id) {
        alert('Selecione uma empresa.')
        return
      }
      if (!totalAmountNumber || totalAmountNumber <= 0) {
        alert('Informe um valor total válido.')
        return
      }
      if (!formData.installments || formData.installments < 1) {
        alert('Informe um número válido de parcelas.')
        return
      }
      if (!formData.first_due_date) {
        alert('Informe a data do primeiro vencimento.')
        return
      }
      if (!formData.installment_interval || formData.installment_interval < 1) {
        alert('Informe um intervalo válido entre parcelas.')
        return
      }
      if (!formData.description) {
        alert('Informe uma descrição para o boleto.')
        return
      }

      // Criar o boleto com valor numérico
      const payload = { ...formData, total_amount: totalAmountNumber }
      const newBill = await billsAPI.create(payload)
      
      // Gerar as parcelas automaticamente
      if (newBill && formData.installments > 0 && formData.first_due_date) {
        await billsAPI.generateInstallments(
          newBill.id,
          totalAmountNumber,
          formData.installments,
          formData.installment_interval,
          formData.first_due_date
        )
      }
      
      // Fechar modal e limpar formulário
      setShowCreateModal(false)
      setFormData({
        company_id: '',
        company_name: '',
        total_amount: '',
        installments: 1,
        installment_interval: 30,
        first_due_date: '',
        description: '',
        type: 'receivable',
        admin_notes: ''
      })
      
      // Recarregar os dados
      await loadBills()
    } catch (error) {
      console.error('Erro ao criar boleto:', error)
      alert('Erro ao criar boleto. Tente novamente.')
    }
  }

  const handleUpdateBill = async () => {
    try {
      const totalAmountNumber = parseBRLToNumber(formData.total_amount)
      await billsAPI.update(selectedBill.id, { ...formData, total_amount: totalAmountNumber })
      setShowEditModal(false)
      await loadBills()
    } catch (error) {
      console.error('Erro ao atualizar boleto:', error)
      alert('Erro ao atualizar boleto. Tente novamente.')
    }
  }

  const handleDeleteBill = async (billId) => {
    if (!confirm('Tem certeza que deseja excluir este boleto?')) return
    
    try {
      await billsAPI.delete(billId)
      await loadBills()
    } catch (error) {
      console.error('Erro ao excluir boleto:', error)
      alert('Erro ao excluir boleto. Tente novamente.')
    }
  }

  const handleUpdateInstallment = async () => {
    try {
      await billsAPI.updateInstallment(selectedInstallment.id, {
        status: selectedInstallment.status,
        paid_date: selectedInstallment.status === 'paid' ? selectedInstallment.paid_date : null,
        payment_notes: selectedInstallment.payment_notes,
        payment_receipt_url: selectedInstallment.payment_receipt_url || null,
        payment_receipt_filename: selectedInstallment.payment_receipt_filename || null,
        payment_receipt_path: selectedInstallment.payment_receipt_path || null,
        payment_receipt_uploaded_at: selectedInstallment.payment_receipt_uploaded_at || null,
      })
      if (selectedBill?.id) {
        try { await billsAPI.recalculateBillStatus(selectedBill.id) } catch {}
      }
      await loadBills()
      const updatedBills = await billsAPI.getAll()
      const updatedBill = updatedBills.find(bill => bill.id === selectedBill?.id)
      if (updatedBill) setSelectedBill(updatedBill)
      setShowInstallmentModal(false)
      setSelectedInstallment(null)
    } catch (err) {
      alert('Erro ao atualizar parcela. Tente novamente.')
    }
  }

  // Funções de ação da tabela
  const handleViewBill = (bill) => {
    setSelectedBill(bill)
    setShowDetailsModal(true)
  }

  const handleOpenInstallmentModal = (installment) => {
    setSelectedInstallment(installment)
    setShowInstallmentModal(true)
  }

  const handleEditBill = (bill) => {
    // Garantir máscara no valor para edição
    const maskedAmount = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(bill.total_amount || 0))
    setSelectedBill(bill)
    setFormData({
      company_id: bill.company_id || bill.companies?.id || '',
      company_name: bill.company_name || bill.companies?.name || '',
      total_amount: maskedAmount,
      installments: bill.bill_installments?.length || 1,
      first_due_date: bill.bill_installments?.[0]?.due_date?.split('T')[0] || '',
      description: bill.description || '',
      type: bill.type,
      admin_notes: bill.admin_notes || ''
    })
    setShowEditModal(true)
  }

  // Filtros
  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || bill.status === statusFilter
    const matchesType = typeFilter === 'all' || bill.type === typeFilter
    const createdDate = (bill.created_at || '').split('T')[0]
    const matchesDate = (!startDate || createdDate >= startDate) && (!endDate || createdDate <= endDate)
    const billCompanyId = bill.company_id || bill.companies?.id
    const matchesCompany = companyFilter === 'all' || billCompanyId === companyFilter
    return matchesSearch && matchesStatus && matchesType && matchesDate && matchesCompany
  })

  // Cálculos de estatísticas
  const totalReceivable = filteredBills
    .filter(bill => bill.type === 'receivable' && bill.status === 'pending')
    .reduce((sum, bill) => sum + parseFloat(bill.total_amount || 0), 0)

  const totalPayable = filteredBills
    .filter(bill => bill.type === 'payable' && bill.status === 'pending')
    .reduce((sum, bill) => sum + parseFloat(bill.total_amount || 0), 0)

  const totalOverdue = filteredBills
    .filter(bill => bill.status === 'overdue')
    .reduce((sum, bill) => sum + parseFloat(bill.total_amount || 0), 0)

  const openBills = filteredBills.filter(b => b.status === 'pending')
  const openBillsAmount = openBills.reduce((s, b) => s + parseFloat(b.total_amount || 0), 0)

  const paidBills = filteredBills.filter(b => b.status === 'paid')
  const paidBillsAmount = paidBills.reduce((s, b) => s + parseFloat(b.total_amount || 0), 0)

  const pendingInstallments = filteredBills
    .filter(bill => bill.status === 'pending')
    .flatMap(bill => bill.bill_installments || [])
    .filter(installment => installment.status === 'pending')

  const overdueInstallments = filteredBills
    .flatMap(bill => bill.bill_installments || [])
    .filter(installment => installment.status === 'overdue')

  const allInstallments = filteredBills.flatMap(b => b.bill_installments || [])
  const paidInstallments = allInstallments.filter(i => i.status === 'paid')
  const paidInstallmentsAmount = paidInstallments.reduce((s, i) => s + parseFloat(i.amount || 0), 0)
  const pendingInstallmentsAmount = pendingInstallments.reduce((s, i) => s + parseFloat(i.amount || 0), 0)
  const overdueInstallmentsAmount = overdueInstallments.reduce((s, i) => s + parseFloat(i.amount || 0), 0)

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'ID','Empresa','Tipo','Valor Total','Status','Parcelas','Parcelas Pagas','Parcelas Pendentes','Parcelas Vencidas','Valor Pagas','Valor Pendentes','Valor Vencidas','Criado Em','Primeiro Vencimento'
    ]
    const rows = filteredBills.map(b => {
      const installments = b.bill_installments || []
      const paid = installments.filter(i => i.status === 'paid')
      const pend = installments.filter(i => i.status === 'pending')
      const over = installments.filter(i => i.status === 'overdue')
      const sum = arr => arr.reduce((s, i) => s + parseFloat(i.amount || 0), 0)
      return [
        b.id,
        (b.company_name || b.companies?.name || '').replaceAll(';', ','),
        b.type,
        String(b.total_amount).replace('.', ','),
        b.status,
        installments.length,
        paid.length,
        pend.length,
        over.length,
        String(sum(paid)).replace('.', ','),
        String(sum(pend)).replace('.', ','),
        String(sum(over)).replace('.', ','),
        (b.created_at || '').split('T')[0],
        (installments[0]?.due_date || '').split('T')[0]
      ]
    })
    const csv = [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `boletos_${new Date().toISOString().slice(0,10)}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Boletos</h1>
          <p className="text-gray-600">Gerencie todos os boletos e parcelas</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Boleto
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <BillsStatistics
        totalReceivable={totalReceivable}
        totalPayable={totalPayable}
        totalOverdue={totalOverdue}
        openBills={openBills}
        openBillsAmount={openBillsAmount}
        paidBills={paidBills}
        paidBillsAmount={paidBillsAmount}
        pendingInstallments={pendingInstallments}
        pendingInstallmentsAmount={pendingInstallmentsAmount}
        overdueInstallments={overdueInstallments}
        overdueInstallmentsAmount={overdueInstallmentsAmount}
        paidInstallments={paidInstallments}
        paidInstallmentsAmount={paidInstallmentsAmount}
      />

      {/* Filtros */}
      <BillsFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        companyFilter={companyFilter}
        setCompanyFilter={setCompanyFilter}
        companies={companies}
      />

      {/* Tabela */}
      <BillsTable
        bills={filteredBills}
        onView={handleViewBill}
        onEdit={handleEditBill}
        onDelete={handleDeleteBill}
      />

      {/* Modal de Criação */}
      <CreateBillModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        formData={formData}
        setFormData={setFormData}
        companies={companies}
        onCompanyChange={handleCompanyChange}
        onSubmit={handleCreateBill}
      />

      {/* Modal de Edição */}
      <EditBillModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        formData={formData}
        setFormData={setFormData}
        companies={companies}
        onCompanyChange={handleCompanyChange}
        onSubmit={handleUpdateBill}
      />

      {/* Modal de Visualização */}
      <ViewBillModal
        open={showDetailsModal}
        onOpenChange={setShowDetailsModal}
        bill={selectedBill}
        onEditInstallment={handleOpenInstallmentModal}
      />

      {/* Modal de Parcela */}
      <InstallmentModal
        open={showInstallmentModal}
        onOpenChange={setShowInstallmentModal}
        installment={selectedInstallment}
        setInstallment={setSelectedInstallment}
        bill={selectedBill}
        onSubmit={handleUpdateInstallment}
        zIndex={10040}
      />
    </div>
  )
} 