import { supabase } from '../lib/supabase'

export const contactAPI = {
  // Enviar mensagem de contato
  async sendMessage(message) {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([message])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Buscar todas as mensagens (apenas para admin)
  async getAllMessages() {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Buscar mensagem por ID (apenas para admin)
  async getMessageById(id) {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Deletar mensagem (apenas para admin)
  async deleteMessage(id) {
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  }
}

