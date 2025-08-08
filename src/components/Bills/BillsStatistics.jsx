import React from 'react'
import { DollarSign, Calendar, FileText } from 'lucide-react'

export default function BillsStatistics({ 
  totalReceivable, 
  totalPayable, 
  totalOverdue, 
  openBills, 
  openBillsAmount,
  paidBills,
  paidBillsAmount,
  pendingInstallments,
  pendingInstallmentsAmount,
  overdueInstallments,
  overdueInstallmentsAmount,
  paidInstallments,
  paidInstallmentsAmount
}) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount)
  }

  const stats = [
    {
      title: 'Total a Receber',
      value: formatCurrency(totalReceivable),
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Total a Pagar',
      value: formatCurrency(totalPayable),
      icon: DollarSign,
      color: 'purple'
    },
    {
      title: 'Vencidos',
      value: formatCurrency(totalOverdue),
      icon: Calendar,
      color: 'red'
    },
    {
      title: 'Boletos em Aberto',
      value: openBills.length,
      subtitle: formatCurrency(openBillsAmount),
      icon: FileText,
      color: 'yellow'
    },
    {
      title: 'Boletos Pagos',
      value: paidBills.length,
      subtitle: formatCurrency(paidBillsAmount),
      icon: Calendar,
      color: 'green'
    },
    {
      title: 'Parcelas Pendentes',
      value: pendingInstallments.length,
      subtitle: formatCurrency(pendingInstallmentsAmount),
      icon: FileText,
      color: 'yellow'
    },
    {
      title: 'Parcelas Vencidas',
      value: overdueInstallments.length,
      subtitle: formatCurrency(overdueInstallmentsAmount),
      icon: Calendar,
      color: 'red'
    },
    {
      title: 'Parcelas Pagas',
      value: paidInstallments.length,
      subtitle: formatCurrency(paidInstallmentsAmount),
      icon: DollarSign,
      color: 'green'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        const colorClasses = {
          green: 'bg-green-100 text-green-600',
          purple: 'bg-purple-100 text-purple-600',
          red: 'bg-red-100 text-red-600',
          yellow: 'bg-yellow-100 text-yellow-600'
        }
        
        return (
          <div key={index} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${colorClasses[stat.color]}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                {stat.subtitle && (
                  <p className="text-xs text-gray-500">{stat.subtitle}</p>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
