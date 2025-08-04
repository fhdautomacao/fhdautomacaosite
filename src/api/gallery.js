import { supabase } from '../lib/supabase'

export const galleryAPI = {
  // Buscar todos os itens da galeria
  async getAll() {
    const { data, error } = await supabase
      .from('gallery_items')
      .select('*')
      .order('display_order', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Buscar item da galeria por ID
  async getById(id) {
    const { data, error } = await supabase
      .from('gallery_items')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Criar novo item da galeria
  async create(item) {
    const { data, error } = await supabase
      .from('gallery_items')
      .insert([item])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Atualizar item da galeria
  async update(id, updates) {
    const { data, error } = await supabase
      .from('gallery_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Deletar item da galeria
  async delete(id) {
    const { error } = await supabase
      .from('gallery_items')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Buscar itens da galeria por categoria
  async getByCategory(category) {
    const { data, error } = await supabase
      .from('gallery_items')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('display_order', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Buscar itens ativos da galeria
  async getActive() {
    const { data, error } = await supabase
      .from('gallery_items')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Atualizar ordem de exibição
  async updateDisplayOrder(id, displayOrder) {
    const { data, error } = await supabase
      .from('gallery_items')
      .update({ display_order: displayOrder })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Ativar/desativar item da galeria
  async toggleActive(id, isActive) {
    const { data, error } = await supabase
      .from('gallery_items')
      .update({ is_active: isActive })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

