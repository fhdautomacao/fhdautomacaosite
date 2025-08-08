import React from 'react'
import AdminDialog from '@/components/admin/AdminDialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

function getStatusColor(status) {
  switch (status) {
    case 'paid': return 'bg-green-100 text-green-800'
    case 'pending': return 'bg-yellow-100 text-yellow-800'
    case 'overdue': return 'bg-red-100 text-red-800'
    case 'cancelled': return 'bg-gray-100 text-gray-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount || 0)
}

export default function ViewBillModal({ open, onOpenChange, bill, onEditInstallment }) {
  if (!bill) return null

  const installments = bill.bill_installments || []

  return (
    <AdminDialog open={open} onOpenChange={onOpenChange} title="Detalhes do Boleto" description="Visualize as informações e parcelas." className="max-w-3xl" zIndex={10020}>
      <div className="space-y-6">
        <section className="p-4 rounded-2xl border border-gray-200 bg-gradient-to-b from-white to-gray-50/60">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-600">Empresa</div>
              <div className="font-medium">{bill.company_name}</div>
            </div>
            <div>
              <div className="text-gray-600">Tipo</div>
              <div>
                <Badge className={bill.type === 'receivable' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}>
                  {bill.type === 'receivable' ? 'A Receber' : 'A Pagar'}
                </Badge>
              </div>
            </div>
            <div>
              <div className="text-gray-600">Valor Total</div>
              <div className="font-semibold">{formatCurrency(bill.total_amount)}</div>
            </div>
            <div>
              <div className="text-gray-600">Status</div>
              <div>
                <Badge className={getStatusColor(bill.status)}>
                  {bill.status === 'pending' ? 'Pendente' : bill.status === 'paid' ? 'Pago' : bill.status === 'overdue' ? 'Vencido' : 'Cancelado'}
                </Badge>
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="text-gray-600">Descrição</div>
              <div>{bill.description}</div>
            </div>
            {bill.admin_notes && (
              <div className="md:col-span-2">
                <div className="text-gray-600">Observações</div>
                <div>{bill.admin_notes}</div>
              </div>
            )}
          </div>
        </section>

        <section className="p-4 rounded-2xl border border-gray-200 bg-gradient-to-b from-white to-gray-50/60">
          <h4 className="text-base font-semibold mb-3">Parcelas</h4>
          <div className="space-y-2">
            {installments.length > 0 ? (
              installments.map((i) => (
                <div key={i.id} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <div className="font-medium">Parcela {i.installment_number}</div>
                      <div className="text-gray-600">Venc.: {new Date(i.due_date).toLocaleDateString('pt-BR')}</div>
                      {i.paid_date && (
                        <div className="text-green-600">Pago: {new Date(i.paid_date).toLocaleDateString('pt-BR')}</div>
                      )}
                    </div>
                    <div className="font-semibold">{formatCurrency(i.amount)}</div>
                    <Badge className={getStatusColor(i.status)}>
                      {i.status === 'pending' ? 'Pendente' : i.status === 'paid' ? 'Pago' : i.status === 'overdue' ? 'Vencido' : 'Cancelado'}
                    </Badge>
                  </div>
                  <div>
                    <Button variant="outline" size="sm" onClick={()=>onEditInstallment?.(i)}>Editar</Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500 border rounded-lg bg-white">Nenhuma parcela encontrada.</div>
            )}
          </div>
        </section>
      </div>
    </AdminDialog>
  )
}
