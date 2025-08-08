import React from 'react'
import { Eye, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function BillsTable({ 
  bills, 
  onView, 
  onEdit, 
  onDelete 
}) {
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
    switch (type) {
      case 'receivable': return 'bg-blue-100 text-blue-800'
      case 'payable': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount)
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-0">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                Empresa
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                Valor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                Parcelas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                Pagas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bills.map((bill, idx) => {
              const paidInstallments = (bill.bill_installments || []).filter(i => i.status === 'paid').length
              return (
                <tr key={bill.id} className="hover:bg-gray-50 border-b border-gray-100">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-100">
                    {idx + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-r border-gray-100">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {bill.company_name}
                      </div>
                      {bill.description && (
                        <div className="text-sm text-gray-500">{bill.description}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-r border-gray-100">
                    <Badge className={getTypeColor(bill.type)}>
                      {bill.type === 'receivable' ? 'A Receber' : 'A Pagar'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-100">
                    {formatCurrency(bill.total_amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-r border-gray-100">
                    <Badge className={getStatusColor(bill.status)}>
                      {bill.status === 'pending' ? 'Pendente' : 
                       bill.status === 'paid' ? 'Pago' : 
                       bill.status === 'overdue' ? 'Vencido' : 'Cancelado'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-100">
                    {bill.bill_installments?.length || 0} parcelas
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-100">
                    {paidInstallments} pagas
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium border-r border-gray-100">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onView(bill)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(bill)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(bill.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
