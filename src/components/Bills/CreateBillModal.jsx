import React, { useMemo } from 'react'
import AdminDialog from '@/components/admin/AdminDialog'
import AdminSelect from '@/components/admin/AdminSelect'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Building2, DollarSign, Calendar as CalendarIcon, Layers } from 'lucide-react'

export default function CreateBillModal({
  open,
  onOpenChange,
  formData,
  setFormData,
  companies,
  onCompanyChange,
  onSubmit
}) {
  const typeOptions = useMemo(() => ([
    { value: 'receivable', label: 'A Receber' },
    { value: 'payable', label: 'A Pagar' },
  ]), [])
  const companyOptions = useMemo(() => (companies || []).map(c => ({ value: c.id, label: c.name })), [companies])

  // Validação simples inline
  const errors = {
    company_id: !formData.company_id ? 'Selecione uma empresa' : '',
    total_amount: !formData.total_amount ? 'Informe o valor total' : '',
    installments: !formData.installments || formData.installments < 1 ? 'Mínimo 1' : '',
    installment_interval: !formData.installment_interval || formData.installment_interval < 1 ? 'Mínimo 1 dia' : '',
    first_due_date: !formData.first_due_date ? 'Informe a data' : '',
    description: !formData.description ? 'Informe a descrição' : '',
  }

  // Máscara de moeda em tempo real (R$)
  const formatCurrencyBR = (value) => {
    const onlyDigits = String(value).replace(/[\D]/g, '')
    const asNumber = Number(onlyDigits) / 100
    if (isNaN(asNumber)) return ''
    return asNumber.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  const handleMoneyChange = (e) => {
    const masked = formatCurrencyBR(e.target.value)
    setFormData({ ...formData, total_amount: masked })
  }

  const handleMoneyFocus = (e) => {
    // Ao focar, se não tiver valor, iniciar com R$ 0,00
    if (!formData.total_amount) {
      setFormData({ ...formData, total_amount: formatCurrencyBR('0') })
    }
  }

  return (
    <AdminDialog open={open} onOpenChange={onOpenChange} title="Novo Boleto" description="Crie um novo boleto com parcelas." className="max-w-3xl">
      <div className="space-y-6" autoComplete="off">
        {/* Informações Básicas */}
        <section className="p-4 rounded-2xl border border-gray-200 bg-gradient-to-b from-white to-gray-50/60">
          <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-blue-500" /> Informações Básicas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Empresa</Label>
              <AdminSelect
                value={formData.company_id}
                onChange={onCompanyChange}
                options={companyOptions}
                placeholder="Selecione uma empresa"
              />
              {errors.company_id && <p className="text-xs text-red-600 mt-1">{errors.company_id}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Valor Total</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  autoComplete="off"
                  value={formData.total_amount}
                  onChange={handleMoneyChange}
                  onFocus={handleMoneyFocus}
                  placeholder="R$ 0,00"
                  className="pl-9"
                />
              </div>
              {errors.total_amount && <p className="text-xs text-red-600 mt-1">{errors.total_amount}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Tipo</Label>
              <AdminSelect value={formData.type} onChange={(value) => setFormData({...formData, type: value})} options={typeOptions} />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label>Descrição</Label>
              <Input
                autoComplete="off"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Descrição do boleto..."
              />
              {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description}</p>}
            </div>
          </div>
        </section>

        {/* Configuração de Parcelas */}
        <section className="p-4 rounded-2xl border border-gray-200 bg-gradient-to-b from-white to-gray-50/60">
          <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
            <Layers className="h-4 w-4 text-blue-500" /> Configuração de Parcelas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Número de Parcelas</Label>
              <Input type="number" autoComplete="off" min="1" value={formData.installments} onChange={(e) => setFormData({...formData, installments: parseInt(e.target.value)})} />
              {errors.installments && <p className="text-xs text-red-600 mt-1">{errors.installments}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Intervalo entre Parcelas (dias)</Label>
              <Input type="number" autoComplete="off" min="1" step="1" placeholder="Ex.: 30" value={formData.installment_interval} onChange={(e) => setFormData({ ...formData, installment_interval: parseInt(e.target.value || '0') })} />
              {errors.installment_interval && <p className="text-xs text-red-600 mt-1">{errors.installment_interval}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Data do Primeiro Vencimento</Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input type="date" autoComplete="off" value={formData.first_due_date} onChange={(e) => setFormData({...formData, first_due_date: e.target.value})} className="pl-9" />
              </div>
              {errors.first_due_date && <p className="text-xs text-red-600 mt-1">{errors.first_due_date}</p>}
            </div>
          </div>
        </section>

        {/* Observações */}
        <section className="p-4 rounded-2xl border border-gray-200 bg-gradient-to-b from-white to-gray-50/60">
          <h3 className="text-base font-semibold mb-3">Observações</h3>
          <div className="space-y-1.5">
            <Label>Observações Administrativas</Label>
            <Textarea autoComplete="off" value={formData.admin_notes} onChange={(e) => setFormData({...formData, admin_notes: e.target.value})} rows={3} placeholder="Observações sobre este boleto..." />
          </div>
        </section>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t mt-4">
        <Button variant="outline" onClick={() => onOpenChange(false)} className="border-gray-300">Cancelar</Button>
        <Button onClick={onSubmit} className="bg-blue-600 hover:bg-blue-700 text-white">Criar Boleto</Button>
      </div>
    </AdminDialog>
  )
}
