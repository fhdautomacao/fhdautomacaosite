import { supabase } from '../lib/supabase'

export const contactAPI = {
  // Buscar todas as mensagens de contato
  async getAllMessages() {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Buscar mensagem por ID
  async getMessageById(id) {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Criar nova mensagem de contato
  async createMessage(message) {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([message])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Marcar mensagem como lida
  async markAsRead(id) {
    const { data, error } = await supabase
      .from('contact_messages')
      .update({ is_read: true })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Deletar mensagem
  async deleteMessage(id) {
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Buscar mensagens não lidas
  async getUnreadMessages() {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .eq('is_read', false)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Buscar informações de contato
  async getContactInfo() {
    const { data, error } = await supabase
      .from('contact_info')
      .select('*')
      .single()
    
    if (error) throw error
    return data
  },

  // Atualizar informações de contato
  async updateContactInfo(id, updates) {
    const { data, error } = await supabase
      .from('contact_info')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Criar informações de contato
  async createContactInfo(contactInfo) {
    const { data, error } = await supabase
      .from('contact_info')
      .insert([contactInfo])
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

