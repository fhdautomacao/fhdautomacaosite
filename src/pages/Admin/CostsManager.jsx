import React, { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import AdminModal from '@/components/admin/AdminModal'
import { ModalActionButton, ModalSection, ModalGrid } from '@/components/admin/AdminModal'
import { costsAPI } from '@/api/costs'
import { 
  Plus, Search, Edit, Trash2, Calendar, DollarSign, Download, ListChecks, RefreshCw, Save
} from 'lucide-react'

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0)

export default function CostsManager() {
  const [costs, setCosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [kindFilter, setKindFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [selected, setSelected] = useState(null)

  // Estados para validação
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [form, setForm] = useState({
    kind: 'variable',
    category: '',
    description: '',
    total_amount: '',
    installments: 1,
    installment_interval: 30,
    first_due_date: '',
    monthly_amount: '',
    due_day: 5,
    start_month: '',
    end_month: '',
    admin_notes: ''
  })
  const [startMonthText, setStartMonthText] = useState('')
  const [endMonthText, setEndMonthText] = useState('')

  const toIsoMonth = (text) => {
    if (!text) return ''
    const mmYYYY = text.match(/^\s*(\d{2})\/(\d{4})\s*$/)
    if (mmYYYY) {
      const [_, mm, yyyy] = mmYYYY
      return `${yyyy}-${mm}-01`
    }
    const yyyyMM = text.match(/^\s*(\d{4})-(\d{2})\s*$/)
    if (yyyyMM) {
      const [_, yyyy, mm] = yyyyMM
      return `${yyyy}-${mm}-01`
    }
    return ''
  }

  const fromIsoToMonthText = (iso) => {
    if (!iso) return ''
    const m = iso.match(/^(\d{4})-(\d{2})-\d{2}$/)
    if (!m) return ''
    return `${m[2]}/${m[1]}`
  }

  // Função para validar formulário
  const validateForm = () => {
    const newErrors = {}

    // Validação de descrição
    if (!form.description) {
      newErrors.description = 'Informe a descrição'
    }

    // Validações específicas por tipo
    if (form.kind === 'variable') {
      if (!form.total_amount || parseFloat(form.total_amount) <= 0) {
        newErrors.total_amount = 'Valor total deve ser maior que zero'
      }
      if (!form.installments || parseInt(form.installments) < 1) {
        newErrors.installments = 'Número de parcelas deve ser pelo menos 1'
      }
      if (!form.installment_interval || parseInt(form.installment_interval) < 1) {
        newErrors.installment_interval = 'Intervalo deve ser pelo menos 1 dia'
      }
      if (!form.first_due_date) {
        newErrors.first_due_date = 'Data do primeiro vencimento é obrigatória'
      } else {
        const selectedDate = new Date(form.first_due_date)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        if (selectedDate < today) {
          newErrors.first_due_date = 'Data de vencimento não pode ser no passado'
        }
      }
    } else {
      if (!form.monthly_amount || parseFloat(form.monthly_amount) <= 0) {
        newErrors.monthly_amount = 'Valor mensal deve ser maior que zero'
      }
      if (!form.start_month) {
        newErrors.start_month = 'Mês inicial é obrigatório'
      }
      if (!form.due_day || parseInt(form.due_day) < 1 || parseInt(form.due_day) > 31) {
        newErrors.due_day = 'Dia de vencimento deve ser entre 1 e 31'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  useEffect(() => { load() }, [])
  const load = async () => {
    setLoading(true)
    try { setCosts(await costsAPI.getAll()) } finally { setLoading(false) }
  }

  const filtered = useMemo(() => {
    return costs.filter(c => {
      const matchesSearch = c.description?.toLowerCase().includes(search.toLowerCase()) || c.category?.toLowerCase().includes(search.toLowerCase())
      const matchesKind = kindFilter === 'all' || c.kind === kindFilter
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter
      const created = (c.created_at || '').split('T')[0]
      const matchesDate = (!startDate || created >= startDate) && (!endDate || created <= endDate)
      return matchesSearch && matchesKind && matchesStatus && matchesDate
    })
  }, [costs, search, kindFilter, statusFilter, startDate, endDate])

  const totals = useMemo(() => {
    const thisMonth = new Date(); thisMonth.setDate(1)
    const monthStr = thisMonth.toISOString().slice(0,7)
    const installments = filtered.flatMap(c => c.cost_installments || [])
    const inMonth = installments.filter(i => (i.due_date || '').startsWith(monthStr))
    const pendingMonth = inMonth.filter(i => i.status === 'pending').reduce((s,i)=>s+parseFloat(i.amount||0),0)
    const paidMonth = inMonth.filter(i => i.status === 'paid').reduce((s,i)=>s+parseFloat(i.amount||0),0)
    const overdue = installments.filter(i => i.status === 'overdue').reduce((s,i)=>s+parseFloat(i.amount||0),0)
    return { pendingMonth, paidMonth, overdue }
  }, [filtered])

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleCreate = async () => {
    try {
      setIsSubmitting(true)
      setErrors({})

      // Validar formulário
      if (!validateForm()) {
        setIsSubmitting(false)
        return
      }

      // Garantir que campos de data vazios não sejam enviados como ""
      const sanitized = { ...form }
      if (sanitized.kind === 'variable') {
        // já validado acima
      } else {
        if (!sanitized.end_month) sanitized.end_month = null
      }

      const cost = await costsAPI.create(sanitized)
      if (form.kind === 'variable') {
        await costsAPI.generateVariableInstallments(cost.id, parseFloat(form.total_amount), parseInt(form.installments), parseInt(form.installment_interval), form.first_due_date)
      } else {
        await costsAPI.generateFixedInstallments(cost.id, parseFloat(form.monthly_amount), form.start_month, parseInt(form.due_day), form.end_month || null)
      }
      setShowCreate(false)
      setForm({
        kind: 'variable',
        category: '',
        description: '',
        total_amount: '',
        installments: 1,
        installment_interval: 30,
        first_due_date: '',
        monthly_amount: '',
        due_day: 5,
        start_month: '',
        end_month: '',
        admin_notes: ''
      })
      setStartMonthText('')
      setEndMonthText('')
      setErrors({})
      await load()
    } catch (err) {
      console.error('Erro ao criar custo:', err)
      setErrors({ submit: "Erro ao criar custo. Verifique os dados e tente novamente." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateInstallment = async (installment, updates) => {
    try {
      await costsAPI.updateInstallment(installment.id, updates)
      const costId = installment.cost_id || selected?.id
      if (costId) {
        await costsAPI.recalculateCostStatus(costId)
      }
      // Recarregar lista e também atualizar o selecionado dentro do modal
      await load()
      if (selected?.id) {
        // Buscar o custo atualizado e substituir no estado "selected"
        const refreshed = costs.find(c => c.id === selected.id)
        if (refreshed) {
          setSelected(refreshed)
        } else {
          // Em caso do estado ainda não refletir, refetch isolado
          try {
            const all = await costsAPI.getAll()
            const current = all.find(c => c.id === selected.id)
            if (current) setSelected(current)
          } catch {}
        }
      }
    } catch (err) {
      console.error('Erro ao atualizar parcela de custo:', err)
      alert(err?.message || 'Erro ao atualizar parcela. Tente novamente.')
    }
  }

  const exportCSV = () => {
    const headers = ['ID','Tipo','Categoria','Descrição','Status','Valor Total','Mensal','Criado Em']
    const rows = filtered.map(c => [
      c.id,
      c.kind,
      (c.category||'').replaceAll(';',','),
      (c.description||'').replaceAll(';',','),
      c.status,
      String(c.total_amount||'').replace('.',','),
      String(c.monthly_amount||'').replace('.',','),
      (c.created_at||'').split('T')[0]
    ])
    const csv = [headers.join(';'), ...rows.map(r=>r.join(';'))].join('\n')
    const blob = new Blob([csv], { type:'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href=url; a.download=`custos_${new Date().toISOString().slice(0,10)}.csv`; a.click(); URL.revokeObjectURL(url)
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Custos</h1>
          <p className="text-gray-600">Gerencie custos fixos e variáveis, com histórico e baixa mensal.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCSV}><Download className="h-4 w-4 mr-2"/>Exportar CSV</Button>
          <Button onClick={()=>setShowCreate(true)}><Plus className="h-4 w-4 mr-2"/>Novo Custo</Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg"><Calendar className="h-6 w-6 text-yellow-600"/></div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Pendentes este mês</p>
                <p className="text-2xl font-bold">{formatCurrency(totals.pendingMonth)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg"><ListChecks className="h-6 w-6 text-green-600"/></div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Pagos este mês</p>
                <p className="text-2xl font-bold">{formatCurrency(totals.paidMonth)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg"><Calendar className="h-6 w-6 text-red-600"/></div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Vencidos</p>
                <p className="text-2xl font-bold">{formatCurrency(totals.overdue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4"/>
                <Input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar por descrição ou categoria" className="pl-10"/>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} />
              <span className="text-gray-500">até</span>
              <Input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} />
            </div>
            <Select value={kindFilter} onValueChange={setKindFilter}>
              <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="Tipo"/></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="fixed">Fixo</SelectItem>
                <SelectItem value="variable">Variável</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="Status"/></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="paid">Pago</SelectItem>
                <SelectItem value="overdue">Vencido</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parcelas</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{c.description}</div>
                  </td>
                  <td className="px-6 py-4"><Badge className={c.kind==='fixed'?'bg-purple-100 text-purple-800':'bg-blue-100 text-blue-800'}>{c.kind==='fixed'?'Fixo':'Variável'}</Badge></td>
                  <td className="px-6 py-4">{c.category || '-'}</td>
                  <td className="px-6 py-4">{c.kind==='fixed' ? formatCurrency(c.monthly_amount) : formatCurrency(c.total_amount)}</td>
                  <td className="px-6 py-4"><Badge className={getStatusColor(c.status)}>{c.status === 'pending' ? 'Pendente' : c.status === 'paid' ? 'Pago' : c.status === 'overdue' ? 'Vencido' : 'Cancelado'}</Badge></td>
                  <td className="px-6 py-4">{c.cost_installments?.length || 0}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={()=>{setSelected(c);setShowDetails(true)}}>Detalhes</Button>
                      <Button variant="outline" size="sm" onClick={()=>{setSelected(c);setForm({ ...form, ...c });setShowEdit(true)}}><Edit className="h-4 w-4"/></Button>
                      <Button variant="outline" size="sm" onClick={async()=>{ if(confirm('Excluir este custo?')){ await costsAPI.delete(c.id); await load() } }}><Trash2 className="h-4 w-4"/></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Criar Modal */}
      <AdminModal
        open={showCreate}
        onOpenChange={(open) => {
          setShowCreate(open)
          if (!open) {
            setErrors({})
            setForm({
              kind: 'variable',
              category: '',
              description: '',
              total_amount: '',
              installments: 1,
              installment_interval: 30,
              first_due_date: '',
              monthly_amount: '',
              due_day: 5,
              start_month: '',
              end_month: '',
              admin_notes: ''
            })
            setStartMonthText('')
            setEndMonthText('')
          }
        }}
        title="Novo Custo"
        description="Cadastre custo fixo ou variável."
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

          <ModalSection title="Informações Básicas">
            <ModalGrid cols={2}>
              <div>
                <Label htmlFor="kind" className="text-sm font-medium text-gray-700">Tipo *</Label>
                <Select value={form.kind} onValueChange={v=>setForm({...form, kind:v})}>
                  <SelectTrigger className="mt-1">
                    <SelectValue/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="variable">Variável</SelectItem>
                    <SelectItem value="fixed">Fixo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="category" className="text-sm font-medium text-gray-700">Categoria</Label>
                <Input 
                  id="category"
                  value={form.category} 
                  onChange={e=>setForm({...form, category:e.target.value})}
                  className="mt-1"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">Descrição *</Label>
                <Textarea 
                  id="description"
                  rows={2} 
                  value={form.description} 
                  onChange={e=>setForm({...form, description:e.target.value})}
                  className={`mt-1 ${errors.description ? 'border-red-500 focus:border-red-500' : ''}`}
                />
                {errors.description && (
                  <p className="text-red-600 text-xs mt-1">{errors.description}</p>
                )}
              </div>
            </ModalGrid>
          </ModalSection>

          {form.kind === 'variable' ? (
            <ModalSection title="Configuração de Parcelas">
              <ModalGrid cols={2}>
                <div>
                  <Label htmlFor="total_amount" className="text-sm font-medium text-gray-700">Valor Total *</Label>
                  <Input 
                    id="total_amount"
                    type="number" 
                    step="0.01" 
                    value={form.total_amount} 
                    onChange={e=>setForm({...form, total_amount:e.target.value})}
                    className={`mt-1 ${errors.total_amount ? 'border-red-500 focus:border-red-500' : ''}`}
                  />
                  {errors.total_amount && (
                    <p className="text-red-600 text-xs mt-1">{errors.total_amount}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="installments" className="text-sm font-medium text-gray-700">Nº de Parcelas *</Label>
                  <Input 
                    id="installments"
                    type="number" 
                    min="1" 
                    value={form.installments} 
                    onChange={e=>setForm({...form, installments: parseInt(e.target.value||'1')})}
                    className={`mt-1 ${errors.installments ? 'border-red-500 focus:border-red-500' : ''}`}
                  />
                  {errors.installments && (
                    <p className="text-red-600 text-xs mt-1">{errors.installments}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="installment_interval" className="text-sm font-medium text-gray-700">Intervalo entre Parcelas (dias) *</Label>
                  <Input 
                    id="installment_interval"
                    type="number" 
                    min="1" 
                    value={form.installment_interval} 
                    onChange={e=>setForm({...form, installment_interval: parseInt(e.target.value||'0')})}
                    className={`mt-1 ${errors.installment_interval ? 'border-red-500 focus:border-red-500' : ''}`}
                  />
                  {errors.installment_interval && (
                    <p className="text-red-600 text-xs mt-1">{errors.installment_interval}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="first_due_date" className="text-sm font-medium text-gray-700">Data do Primeiro Vencimento *</Label>
                  <Input 
                    id="first_due_date"
                    type="date" 
                    value={form.first_due_date} 
                    onChange={e=>setForm({...form, first_due_date:e.target.value})}
                    className={`mt-1 ${errors.first_due_date ? 'border-red-500 focus:border-red-500' : ''}`}
                  />
                  {errors.first_due_date && (
                    <p className="text-red-600 text-xs mt-1">{errors.first_due_date}</p>
                  )}
                </div>
              </ModalGrid>
            </ModalSection>
          ) : (
            <ModalSection title="Configuração de Custo Fixo">
              <ModalGrid cols={2}>
                <div>
                  <Label htmlFor="monthly_amount" className="text-sm font-medium text-gray-700">Valor Mensal *</Label>
                  <Input 
                    id="monthly_amount"
                    type="number" 
                    step="0.01" 
                    value={form.monthly_amount} 
                    onChange={e=>setForm({...form, monthly_amount:e.target.value})}
                    className={`mt-1 ${errors.monthly_amount ? 'border-red-500 focus:border-red-500' : ''}`}
                  />
                  {errors.monthly_amount && (
                    <p className="text-red-600 text-xs mt-1">{errors.monthly_amount}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="due_day" className="text-sm font-medium text-gray-700">Dia de Vencimento *</Label>
                  <Input 
                    id="due_day"
                    type="number" 
                    min="1" 
                    max="31" 
                    value={form.due_day} 
                    onChange={e=>setForm({...form, due_day: parseInt(e.target.value||'1')})}
                    className={`mt-1 ${errors.due_day ? 'border-red-500 focus:border-red-500' : ''}`}
                  />
                  {errors.due_day && (
                    <p className="text-red-600 text-xs mt-1">{errors.due_day}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="start_month" className="text-sm font-medium text-gray-700">Mês Inicial *</Label>
                  <Input
                    id="start_month"
                    type="text"
                    placeholder="MM/AAAA"
                    value={startMonthText || fromIsoToMonthText(form.start_month)}
                    onChange={(e)=>{
                      const val = e.target.value
                      setStartMonthText(val)
                      const iso = toIsoMonth(val)
                      setForm({...form, start_month: iso})
                    }}
                    className={`mt-1 ${errors.start_month ? 'border-red-500 focus:border-red-500' : ''}`}
                  />
                  {errors.start_month && (
                    <p className="text-red-600 text-xs mt-1">{errors.start_month}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="end_month" className="text-sm font-medium text-gray-700">Mês Final (opcional)</Label>
                  <Input
                    id="end_month"
                    type="text"
                    placeholder="MM/AAAA"
                    value={endMonthText || fromIsoToMonthText(form.end_month)}
                    onChange={(e)=>{
                      const val = e.target.value
                      setEndMonthText(val)
                      const iso = toIsoMonth(val)
                      setForm({...form, end_month: iso})
                    }}
                    className="mt-1"
                  />
                </div>
              </ModalGrid>
            </ModalSection>
          )}

          <ModalSection title="Observações">
            <div>
              <Label htmlFor="admin_notes" className="text-sm font-medium text-gray-700">Observações Administrativas</Label>
              <Textarea 
                id="admin_notes"
                rows={2} 
                value={form.admin_notes||''} 
                onChange={e=>setForm({...form, admin_notes:e.target.value})}
                placeholder="Observações sobre este custo..."
                className="mt-1"
              />
            </div>
          </ModalSection>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <ModalActionButton
              onClick={() => {
                setShowCreate(false)
                setErrors({})
              }}
              variant="outline"
              disabled={isSubmitting}
            >
              Cancelar
            </ModalActionButton>
            <ModalActionButton
              onClick={handleCreate}
              disabled={isSubmitting}
              variant="success"
              icon={isSubmitting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            >
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </ModalActionButton>
          </div>
        </div>
      </AdminModal>

      {/* Detalhes Modal */}
      <AdminModal
        open={showDetails}
        onOpenChange={setShowDetails}
        title="Detalhes do Custo"
        description="Veja e dê baixa nas parcelas."
        type="view"
        size="2xl"
      >
        {selected && (
          <div className="space-y-6">
            <ModalSection title="Informações Básicas">
              <ModalGrid cols={2}>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Descrição</Label>
                  <p className="text-gray-900 mt-1">{selected.description}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Tipo</Label>
                  <div className="mt-1">
                    <Badge className={selected.kind==='fixed'?'bg-purple-100 text-purple-800':'bg-blue-100 text-blue-800'}>{selected.kind==='fixed'?'Fixo':'Variável'}</Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Valor</Label>
                  <p className="text-gray-900 mt-1">{selected.kind==='fixed' ? formatCurrency(selected.monthly_amount) : formatCurrency(selected.total_amount)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Status</Label>
                  <div className="mt-1">
                    <Badge className={getStatusColor(selected.status)}>{selected.status}</Badge>
                  </div>
                </div>
              </ModalGrid>
            </ModalSection>

            <ModalSection title="Parcelas">
              {/* Limitar visualização a ~6 itens com rolagem */}
              <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1 overscroll-contain">
                {(selected.cost_installments||[]).map(inst=> (
                  <div key={inst.id} className="flex flex-wrap md:flex-nowrap items-start md:items-center justify-between gap-3 p-3 border rounded-lg bg-gray-50">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div>
                        <div className="font-medium">Parcela {inst.installment_number}</div>
                        <div className="text-sm text-gray-600">Vencimento: {new Date(inst.due_date).toLocaleDateString('pt-BR')}</div>
                      </div>
                      <div className="font-semibold whitespace-nowrap">{formatCurrency(inst.amount)}</div>
                      <Badge className={getStatusColor(inst.status)}>{inst.status==='pending'?'Pendente':inst.status==='paid'?'Pago':'Vencido'}</Badge>
                    </div>
                    <div className="flex gap-2 ml-auto">
                      {inst.status !== 'paid' && (
                        <Button size="sm" variant="outline" onClick={()=>handleUpdateInstallment(inst, { status: 'paid', paid_date: new Date().toISOString().slice(0,10) })}>Dar baixa</Button>
                      )}
                      {inst.status === 'pending' && (
                        <Button size="sm" variant="outline" onClick={()=>handleUpdateInstallment(inst, { status: 'overdue' })}>Marcar vencido</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ModalSection>
          </div>
        )}
      </AdminModal>
    </div>
  )
}


