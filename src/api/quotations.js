import { supabase } from '../lib/supabase'

export const quotationsAPI = {
  // Criar novo orçamento
  async create(quotation) {
    const { data, error } = await supabase
      .from('quotations')
      .insert(quotation)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Buscar todos os orçamentos (apenas admin)
  async getAll() {
    const { data, error } = await supabase
      .from('quotations')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Buscar orçamento por ID
  async getById(id) {
    const { data, error } = await supabase
      .from('quotations')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Atualizar orçamento
  async update(id, updates) {
    const { data, error } = await supabase
      .from('quotations')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Deletar orçamento
  async delete(id) {
    const { error } = await supabase
      .from('quotations')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Buscar orçamentos por status
  async getByStatus(status) {
    const { data, error } = await supabase
      .from('quotations')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Contar orçamentos por status
  async getCountByStatus() {
    const { data, error } = await supabase
      .from('quotations')
      .select('status')
    
    if (error) throw error
    
    const counts = {
      pending: 0,
      in_review: 0,
      approved: 0,
      rejected: 0,
      completed: 0
    }
    
    data.forEach(item => {
      if (counts.hasOwnProperty(item.status)) {
        counts[item.status]++
      }
    })
    
    return counts
  }
} 