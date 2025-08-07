import { supabase } from '../lib/supabase'

export const costsAPI = {
  async create(costData) {
    // Sanitização: converter strings vazias em null e ajustar tipos
    const payload = { ...costData }
    if (payload.kind === 'variable') {
      payload.total_amount = payload.total_amount !== '' && payload.total_amount != null ? parseFloat(payload.total_amount) : null
      payload.installments = payload.installments !== '' && payload.installments != null ? parseInt(payload.installments, 10) : null
      payload.installment_interval = payload.installment_interval !== '' && payload.installment_interval != null ? parseInt(payload.installment_interval, 10) : null
      payload.first_due_date = payload.first_due_date ? payload.first_due_date : null
      // Campos não usados em variável
      payload.monthly_amount = null
      payload.due_day = null
      payload.start_month = null
      payload.end_month = null
    } else {
      // fixed
      payload.monthly_amount = payload.monthly_amount !== '' && payload.monthly_amount != null ? parseFloat(payload.monthly_amount) : null
      payload.due_day = payload.due_day !== '' && payload.due_day != null ? parseInt(payload.due_day, 10) : null
      payload.start_month = payload.start_month ? payload.start_month : null
      payload.end_month = payload.end_month ? payload.end_month : null
      // Campos não usados em fixo
      payload.total_amount = null
      payload.installments = null
      payload.installment_interval = null
      payload.first_due_date = null
    }

    const { data, error } = await supabase
      .from('costs')
      .insert(payload)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async getAll() {
    const { data, error } = await supabase
      .from('costs')
      .select(`*, cost_installments (*)`)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('costs')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async delete(id) {
    const { error } = await supabase
      .from('costs')
      .delete()
      .eq('id', id)
    if (error) throw error
  },

  async generateVariableInstallments(costId, totalAmount, installments, interval, firstDueDate) {
    const amount = totalAmount / installments
    const rows = []
    for (let i = 0; i < installments; i++) {
      const due = new Date(firstDueDate)
      due.setDate(due.getDate() + (i * interval))
      rows.push({
        cost_id: costId,
        installment_number: i + 1,
        due_date: due.toISOString().split('T')[0],
        amount,
        status: 'pending'
      })
    }
    const { data, error } = await supabase
      .from('cost_installments')
      .insert(rows)
      .select()
    if (error) throw error
    return data
  },

  async generateFixedInstallments(costId, monthlyAmount, startMonth, dueDay, endMonth = null, monthsAhead = 12) {
    const rows = []
    const start = new Date(startMonth)
    start.setDate(1)
    const end = endMonth ? new Date(endMonth) : null
    const count = end ? (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth() + 1) : monthsAhead

    for (let i = 0; i < count; i++) {
      const d = new Date(start.getFullYear(), start.getMonth() + i, 1)
      const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
      const day = Math.min(dueDay, lastDay)
      const due = new Date(d.getFullYear(), d.getMonth(), day)
      rows.push({
        cost_id: costId,
        installment_number: i + 1,
        due_date: due.toISOString().split('T')[0],
        amount: monthlyAmount,
        status: 'pending'
      })
    }

    const { data, error } = await supabase
      .from('cost_installments')
      .insert(rows)
      .select()
    if (error) throw error
    return data
  },

  async updateInstallment(id, updates) {
    // Sanitizar campos opcionais
    const payload = { ...updates }
    if (payload.paid_date === '') payload.paid_date = null
    const { data, error } = await supabase
      .from('cost_installments')
      .update(payload)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async recalculateCostStatus(costId) {
    const { data: installments, error } = await supabase
      .from('cost_installments')
      .select('status')
      .eq('cost_id', costId)
    if (error) throw error
    if (!installments?.length) return null

    const allPaid = installments.every(i => i.status === 'paid')
    const hasOverdue = installments.some(i => i.status === 'overdue')
    let newStatus = 'pending'
    if (allPaid) newStatus = 'paid'
    else if (hasOverdue) newStatus = 'overdue'

    const { data: updated, error: updError } = await supabase
      .from('costs')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', costId)
      .select('id, status')
      .single()
    if (updError) throw updError
    return updated?.status || newStatus
  },

  // Atualizar parcelas de custos vencidas automaticamente
  async updateOverdueStatus() {
    const today = new Date().toISOString().split('T')[0]
    const { data, error } = await supabase
      .from('cost_installments')
      .update({ status: 'overdue', updated_at: new Date().toISOString() })
      .eq('status', 'pending')
      .lt('due_date', today)
      .select()
    if (error) throw error
    return { updated: data || [], total: data?.length || 0 }
  }
}


