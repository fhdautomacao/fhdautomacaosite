import { supabase } from '../lib/supabase'

export const contactInfoAPI = {
  // Buscar informações de contato
  async getInfo() {
    const { data, error } = await supabase
      .from('contact_info')
      .select('*')
      .single()
    
    if (error) throw error
    return data
  },

  // Atualizar informações de contato
  async updateInfo(info) {
    const { data, error } = await supabase
      .from('contact_info')
      .update(info)
      .eq('id', info.id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Criar informações de contato
  async createInfo(info) {
    const { data, error } = await supabase
      .from('contact_info')
      .insert([info])
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

