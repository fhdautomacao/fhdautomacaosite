import React from 'react'
import AdminDialog from '@/components/admin/AdminDialog'
import AdminSelect from '@/components/admin/AdminSelect'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import PaymentReceiptUpload from '@/components/PaymentReceiptUpload'

const statusOptions = [
  { value: 'pending', label: 'Pendente' },
  { value: 'paid', label: 'Pago' },
  { value: 'overdue', label: 'Vencido' },
  { value: 'cancelled', label: 'Cancelado' },
]

export default function InstallmentModal({
  open,
  onOpenChange,
  installment,
  setInstallment,
  bill,
  onSubmit,
  zIndex = 10030,
}) {
  if (!installment) return null

  return (
    <AdminDialog open={open} onOpenChange={onOpenChange} title={`Editar Parcela #${installment.installment_number}`} description="Atualize o status e informações desta parcela." className="max-w-xl" zIndex={zIndex}>
      <div className="space-y-6">
        <section className="p-4 rounded-2xl border border-gray-200 bg-gradient-to-b from-white to-gray-50/60">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <AdminSelect
                value={installment.status}
                onChange={(v)=>setInstallment({ ...installment, status: v })}
                options={statusOptions}
              />
            </div>

            {installment.status === 'paid' && (
              <div className="space-y-1.5">
                <Label>Data do Pagamento</Label>
                <Input
                  type="date"
                  value={installment.paid_date || new Date().toISOString().split('T')[0]}
                  onChange={(e)=>setInstallment({ ...installment, paid_date: e.target.value })}
                />
                <p className="text-xs text-gray-500">Selecione a data em que o pagamento foi realizado</p>
              </div>
            )}

            <div className="space-y-1.5">
              <Label>Observações do Pagamento</Label>
              <Textarea
                rows={3}
                value={installment.payment_notes || ''}
                onChange={(e)=>setInstallment({ ...installment, payment_notes: e.target.value })}
                placeholder="Observações sobre o pagamento..."
              />
            </div>
          </div>
        </section>

        <section className="p-4 rounded-2xl border border-gray-200 bg-gradient-to-b from-white to-gray-50/60">
          <Label className="mb-2 block">Comprovante de Pagamento</Label>
          <PaymentReceiptUpload
            billId={bill?.id}
            installment={installment}
            billData={bill}
            onUploadSuccess={(result) => {
              if (result?.action === 'delete') {
                setInstallment({
                  ...installment,
                  payment_receipt_url: null,
                  payment_receipt_filename: null,
                  payment_receipt_path: null,
                  payment_receipt_uploaded_at: null,
                })
                return
              }
              setInstallment({
                ...installment,
                payment_receipt_url: result.url,
                payment_receipt_filename: result.filename,
                payment_receipt_path: result.path,
                payment_receipt_uploaded_at: new Date().toISOString(),
                status: 'paid',
              })
            }}
            onUploadError={(error) => {
              alert(`Erro ao fazer upload: ${error}`)
            }}
          />
        </section>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t mt-4">
        <Button variant="outline" onClick={()=>onOpenChange(false)} className="border-gray-300">Cancelar</Button>
        <Button onClick={onSubmit} className="bg-blue-600 hover:bg-blue-700 text-white">Salvar Alterações</Button>
      </div>
    </AdminDialog>
  )
}
