import { supabase } from '../lib/supabase'

export const clientsAPI = {
  // Buscar todos os clientes
  async getAll() {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('display_order', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Buscar cliente por ID
  async getById(id) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Criar novo cliente
  async create(client) {
    const { data, error } = await supabase
      .from('clients')
      .insert([client])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Atualizar cliente
  async update(id, updates) {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Deletar cliente
  async delete(id) {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Buscar clientes ativos
  async getActive() {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Buscar clientes por indústria
  async getByIndustry(industry) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('industry', industry)
      .eq('is_active', true)
      .order('display_order', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Atualizar ordem de exibição
  async updateDisplayOrder(id, displayOrder) {
    const { data, error } = await supabase
      .from('clients')
      .update({ display_order: displayOrder })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Ativar/desativar cliente
  async toggleActive(id, isActive) {
    const { data, error } = await supabase
      .from('clients')
      .update({ is_active: isActive })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

