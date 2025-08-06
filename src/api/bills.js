import { supabase } from '../lib/supabase'

export const billsAPI = {
  // Criar novo boleto
  async create(billData) {
    const { data, error } = await supabase
      .from('bills')
      .insert(billData)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Buscar todos os boletos
  async getAll() {
    const { data, error } = await supabase
      .from('bills')
      .select(`
        *,
        bill_installments (*)
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Buscar boletos por tipo
  async getByType(type) {
    const { data, error } = await supabase
      .from('bills')
      .select(`
        *,
        bill_installments (*)
      `)
      .eq('type', type)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Buscar boleto por ID
  async getById(id) {
    const { data, error } = await supabase
      .from('bills')
      .select(`
        *,
        bill_installments (*)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Atualizar boleto
  async update(id, updates) {
    const { data, error } = await supabase
      .from('bills')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Deletar boleto
  async delete(id) {
    const { error } = await supabase
      .from('bills')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Buscar boletos por status
  async getByStatus(status) {
    const { data, error } = await supabase
      .from('bills')
      .select(`
        *,
        bill_installments (*)
      `)
      .eq('status', status)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Contar boletos por status
  async getCountByStatus() {
    const { data, error } = await supabase
      .from('bills')
      .select('status, type')
    
    if (error) throw error
    
    const counts = {
      payable: { pending: 0, paid: 0, overdue: 0, cancelled: 0 },
      receivable: { pending: 0, paid: 0, overdue: 0, cancelled: 0 }
    }
    
    data.forEach(item => {
      if (counts[item.type] && counts[item.type].hasOwnProperty(item.status)) {
        counts[item.type][item.status]++
      }
    })
    
    return counts
  },

  // Buscar total recebido (boletos do tipo receivable com status paid)
  async getTotalReceived() {
    const { data, error } = await supabase
      .from('bills')
      .select('total_amount')
      .eq('type', 'receivable')
      .eq('status', 'paid')
    
    if (error) throw error
    
    return data.reduce((total, bill) => total + bill.total_amount, 0)
  },

  // Buscar boletos por período
  async getByDateRange(startDate, endDate, filters = {}) {
    let query = supabase
      .from('bills')
      .select(`
        *,
        bill_installments (*)
      `)
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false })

    // Aplicar filtros adicionais
    if (filters.type && filters.type !== 'all') {
      query = query.eq('type', filters.type)
    }
    
    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status)
    }

    if (filters.company_name) {
      query = query.ilike('company_name', `%${filters.company_name}%`)
    }

    const { data, error } = await query
    
    if (error) throw error
    return data
  },

  // Buscar totais por período
  async getTotalsByDateRange(startDate, endDate, type = null) {
    let query = supabase
      .from('bills')
      .select('total_amount, status, type')
      .gte('created_at', startDate)
      .lte('created_at', endDate)

    if (type) {
      query = query.eq('type', type)
    }

    const { data, error } = await query
    
    if (error) throw error
    
    return {
      total: data.reduce((sum, bill) => sum + bill.total_amount, 0),
      paid: data.filter(bill => bill.status === 'paid').reduce((sum, bill) => sum + bill.total_amount, 0),
      pending: data.filter(bill => bill.status === 'pending').reduce((sum, bill) => sum + bill.total_amount, 0),
      overdue: data.filter(bill => bill.status === 'overdue').reduce((sum, bill) => sum + bill.total_amount, 0)
    }
  },

  // Gerar parcelas automaticamente
  async generateInstallments(billId, totalAmount, installments, interval, firstDueDate) {
    const installmentAmount = totalAmount / installments
    const installmentsData = []

    for (let i = 0; i < installments; i++) {
      const dueDate = new Date(firstDueDate)
      dueDate.setDate(dueDate.getDate() + (i * interval))
      
      installmentsData.push({
        bill_id: billId,
        installment_number: i + 1,
        due_date: dueDate.toISOString().split('T')[0],
        amount: installmentAmount,
        status: 'pending'
      })
    }

    const { data, error } = await supabase
      .from('bill_installments')
      .insert(installmentsData)
      .select()
    
    if (error) throw error
    return data
  },

  // Atualizar status de uma parcela
  async updateInstallment(id, updates) {
    const { data, error } = await supabase
      .from('bill_installments')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Deletar parcela
  async deleteInstallment(id) {
    const { error } = await supabase
      .from('bill_installments')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Buscar parcelas por boleto
  async getInstallmentsByBill(billId) {
    const { data, error } = await supabase
      .from('bill_installments')
      .select('*')
      .eq('bill_id', billId)
      .order('installment_number', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Buscar parcelas vencidas
  async getOverdueInstallments() {
    const today = new Date().toISOString().split('T')[0]
    
    const { data, error } = await supabase
      .from('bill_installments')
      .select(`
        *,
        bills (company_name, type)
      `)
      .lt('due_date', today)
      .eq('status', 'pending')
      .order('due_date', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Buscar boletos por empresa
  async getByCompany(companyId) {
    const { data, error } = await supabase
      .from('bills')
      .select(`
        *,
        bill_installments (*)
      `)
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Atualizar status de boletos vencidos automaticamente
  async updateOverdueStatus() {
    const today = new Date().toISOString().split('T')[0]
    
    try {
      // Atualizar boletos principais vencidos
      const { data: updatedBills, error: billsError } = await supabase
        .from('bills')
        .update({ status: 'overdue', updated_at: new Date().toISOString() })
        .eq('status', 'pending')
        .lt('first_due_date', today)
        .select()

      if (billsError) throw billsError

      // Atualizar parcelas vencidas
      const { data: updatedInstallments, error: installmentsError } = await supabase
        .from('bill_installments')
        .update({ status: 'overdue', updated_at: new Date().toISOString() })
        .eq('status', 'pending')
        .lt('due_date', today)
        .select()

      if (installmentsError) throw installmentsError

      return {
        updatedBills: updatedBills || [],
        updatedInstallments: updatedInstallments || [],
        total: (updatedBills?.length || 0) + (updatedInstallments?.length || 0)
      }
    } catch (error) {
      console.error('Erro ao atualizar status de vencidos:', error)
      throw error
    }
  },

  // Buscar boletos que estão vencidos mas ainda com status 'pending'
  async getPendingOverdue() {
    const today = new Date().toISOString().split('T')[0]
    
    const { data, error } = await supabase
      .from('bills')
      .select(`
        *,
        bill_installments (*)
      `)
      .eq('status', 'pending')
      .lt('first_due_date', today)
      .order('first_due_date', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Buscar parcelas que estão vencidas mas ainda com status 'pending'
  async getPendingOverdueInstallments() {
    const today = new Date().toISOString().split('T')[0]
    
    const { data, error } = await supabase
      .from('bill_installments')
      .select(`
        *,
        bills (company_name, description, type)
      `)
      .eq('status', 'pending')
      .lt('due_date', today)
      .order('due_date', { ascending: true })
    
    if (error) throw error
    return data
  }
} 