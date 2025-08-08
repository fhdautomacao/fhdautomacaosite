import React, { useMemo } from 'react'
import AdminDialog from '@/components/admin/AdminDialog'
import AdminSelect from '@/components/admin/AdminSelect'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Building2, DollarSign } from 'lucide-react'

export default function EditBillModal({
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

  const errors = {
    company_id: !formData.company_id ? 'Selecione uma empresa' : '',
    total_amount: !formData.total_amount ? 'Informe o valor total' : '',
    description: !formData.description ? 'Informe a descrição' : '',
  }

  const formatCurrencyBR = (value) => {
    const onlyDigits = String(value).replace(/\D/g, '')
    const asNumber = Number(onlyDigits) / 100
    if (isNaN(asNumber)) return ''
    return asNumber.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  const handleMoneyChange = (e) => {
    const masked = formatCurrencyBR(e.target.value)
    setFormData({ ...formData, total_amount: masked })
  }

  const handleMoneyFocus = () => {
    if (!formData.total_amount) {
      setFormData({ ...formData, total_amount: formatCurrencyBR('0') })
    }
  }

  return (
    <AdminDialog open={open} onOpenChange={onOpenChange} title="Editar Boleto" description="Atualize as informações do boleto." className="max-w-2xl">
      <div className="space-y-6" autoComplete="off">
        <section className="p-4 rounded-2xl border border-gray-200 bg-gradient-to-b from-white to-gray-50/60">
          <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-blue-500" /> Informações
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Empresa</Label>
              <AdminSelect value={formData.company_id} onChange={onCompanyChange} options={companyOptions} placeholder="Selecione uma empresa" />
              {errors.company_id && <p className="text-xs text-red-600 mt-1">{errors.company_id}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Valor Total</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input type="text" autoComplete="off" value={formData.total_amount} onChange={handleMoneyChange} onFocus={handleMoneyFocus} placeholder="R$ 0,00" className="pl-9" />
              </div>
              {errors.total_amount && <p className="text-xs text-red-600 mt-1">{errors.total_amount}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Tipo</Label>
              <AdminSelect value={formData.type} onChange={(v)=>setFormData({...formData, type:v})} options={typeOptions} />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label>Descrição</Label>
              <Input value={formData.description} onChange={(e)=>setFormData({...formData, description: e.target.value})} placeholder="Descrição do boleto..." />
              {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description}</p>}
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label>Observações</Label>
              <Textarea rows={3} value={formData.admin_notes} onChange={(e)=>setFormData({...formData, admin_notes: e.target.value})} placeholder="Observações administrativas..." />
            </div>
          </div>
        </section>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t mt-4">
        <Button variant="outline" onClick={() => onOpenChange(false)} className="border-gray-300">Cancelar</Button>
        <Button onClick={onSubmit} className="bg-blue-600 hover:bg-blue-700 text-white">Salvar Alterações</Button>
      </div>
    </AdminDialog>
  )
}
