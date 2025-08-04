import { supabase } from '../lib/supabase'

export const clientsAPI = {
  // Buscar todos os clientes
  async getAll() {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('name')
    
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
    return true
  },

  // Buscar clientes por setor
  async getByIndustry(industry) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('industry', industry)
      .order('name')
    
    if (error) throw error
    return data
  }
}

