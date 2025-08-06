import { supabase } from '../lib/supabase'

export const profitSharingAPI = {
  // Criar nova divisão de lucro
  async create(profitSharingData) {
    const { data, error } = await supabase
      .from('profit_sharing')
      .insert([profitSharingData])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Buscar todas as divisões de lucro
  async getAll() {
    const { data, error } = await supabase
      .from('profit_sharing')
      .select(`
        *,
        profit_sharing_installments (*)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Buscar divisão de lucro por ID
  async getById(id) {
    const { data, error } = await supabase
      .from('profit_sharing')
      .select(`
        *,
        profit_sharing_installments (*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Buscar divisões por empresa
  async getByCompany(companyId) {
    const { data, error } = await supabase
      .from('profit_sharing')
      .select(`
        *,
        profit_sharing_installments (*)
      `)
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Buscar divisões por status
  async getByStatus(status) {
    const { data, error } = await supabase
      .from('profit_sharing')
      .select(`
        *,
        profit_sharing_installments (*)
      `)
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Atualizar divisão de lucro
  async update(id, updates) {
    const { data, error } = await supabase
      .from('profit_sharing')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Deletar divisão de lucro
  async delete(id) {
    const { error } = await supabase
      .from('profit_sharing')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Gerar parcelas para pagamento do sócio
  async generateInstallments(profitSharingId, partnerShare, installments, installmentInterval, firstDueDate) {
    const installmentAmount = partnerShare / installments
    const installmentsData = []

    for (let i = 0; i < installments; i++) {
      const dueDate = new Date(firstDueDate)
      dueDate.setDate(dueDate.getDate() + (i * installmentInterval))

      installmentsData.push({
        profit_sharing_id: profitSharingId,
        installment_number: i + 1,
        due_date: dueDate.toISOString().split('T')[0],
        amount: installmentAmount,
        status: 'pending'
      })
    }

    const { data, error } = await supabase
      .from('profit_sharing_installments')
      .insert(installmentsData)
      .select()

    if (error) throw error
    return data
  },

  // Buscar parcelas de uma divisão
  async getInstallments(profitSharingId) {
    const { data, error } = await supabase
      .from('profit_sharing_installments')
      .select('*')
      .eq('profit_sharing_id', profitSharingId)
      .order('installment_number')

    if (error) throw error
    return data
  },

  // Atualizar parcela
  async updateInstallment(installmentId, updates) {
    const { data, error } = await supabase
      .from('profit_sharing_installments')
      .update(updates)
      .eq('id', installmentId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Contar divisões por status
  async getCountByStatus(status) {
    const { count, error } = await supabase
      .from('profit_sharing')
      .select('*', { count: 'exact', head: true })
      .eq('status', status)

    if (error) throw error
    return count
  },

  // Buscar parcelas pendentes (vencidas)
  async getOverdueInstallments() {
    const today = new Date().toISOString().split('T')[0]
    
    const { data, error } = await supabase
      .from('profit_sharing_installments')
      .select(`
        *,
        profit_sharing (company_name, bill_description)
      `)
      .eq('status', 'pending')
      .lt('due_date', today)
      .order('due_date')

    if (error) throw error
    return data
  }
}