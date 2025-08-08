import React from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import AdminSelect from '@/components/admin/AdminSelect'

export default function BillsFilters({
  searchTerm,
  setSearchTerm,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  typeFilter,
  setTypeFilter,
  statusFilter,
  setStatusFilter,
  companyFilter,
  setCompanyFilter,
  companies
}) {
  const typeOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'receivable', label: 'A Receber' },
    { value: 'payable', label: 'A Pagar' },
  ]
  const statusOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'pending', label: 'Pendente' },
    { value: 'paid', label: 'Pago' },
    { value: 'overdue', label: 'Vencido' },
    { value: 'cancelled', label: 'Cancelado' },
  ]
  const companyOptions = [
    { value: 'all', label: 'Todas as Empresas' },
    ...(companies || []).map(c => ({ value: c.id, label: c.name }))
  ]

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar boletos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Input 
          type="date" 
          value={startDate} 
          onChange={e => setStartDate(e.target.value)} 
        />
        <span className="text-gray-500">até</span>
        <Input 
          type="date" 
          value={endDate} 
          onChange={e => setEndDate(e.target.value)} 
        />
      </div>

      <div className="sm:w-48">
        <AdminSelect value={typeFilter} onChange={setTypeFilter} options={typeOptions} />
      </div>
      
      <div className="sm:w-48">
        <AdminSelect value={statusFilter} onChange={setStatusFilter} options={statusOptions} />
      </div>

      <div className="sm:w-56">
        <AdminSelect value={companyFilter} onChange={setCompanyFilter} options={companyOptions} />
      </div>
    </div>
  )
}
