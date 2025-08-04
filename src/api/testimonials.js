import { supabase } from '../lib/supabase'

export const testimonialsAPI = {
  // Buscar todos os depoimentos
  async getAll() {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('display_order')
    
    if (error) throw error
    return data
  },

  // Buscar depoimentos ativos
  async getActive() {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_active', true)
      .order('display_order')
    
    if (error) throw error
    return data
  },

  // Buscar depoimento por ID
  async getById(id) {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Criar novo depoimento
  async create(testimonial) {
    const { data, error } = await supabase
      .from('testimonials')
      .insert([testimonial])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Atualizar depoimento
  async update(id, updates) {
    const { data, error } = await supabase
      .from('testimonials')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Deletar depoimento
  async delete(id) {
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  }
}

