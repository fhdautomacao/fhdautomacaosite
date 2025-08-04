import { supabase } from '../lib/supabase'

export const servicesAPI = {
  // Buscar todos os serviços
  async getAll() {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('display_order')
    
    if (error) throw error
    return data
  },

  // Buscar serviços ativos
  async getActive() {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('display_order')
    
    if (error) throw error
    return data
  },

  // Buscar serviço por ID
  async getById(id) {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Criar novo serviço
  async create(service) {
    const { data, error } = await supabase
      .from('services')
      .insert([service])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Atualizar serviço
  async update(id, updates) {
    const { data, error } = await supabase
      .from('services')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Deletar serviço
  async delete(id) {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  },

  // Buscar serviços por categoria
  async getByCategory(category) {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('display_order')
    
    if (error) throw error
    return data
  },

  // Atualizar ordem dos serviços
  async updateOrder(services) {
    const updates = services.map((service, index) => ({
      id: service.id,
      display_order: index
    }))

    const { error } = await supabase
      .from('services')
      .upsert(updates)
    
    if (error) throw error
    return true
  }
}

