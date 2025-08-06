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
  }
} 