import { supabase } from '../lib/supabase'

export const aboutAPI = {
  // Buscar conteúdo sobre
  async getContent() {
    const { data, error } = await supabase
      .from('about_content')
      .select('*')
      .single()
    
    if (error) throw error
    return data
  },

  // Atualizar conteúdo sobre
  async updateContent(content) {
    const { data, error } = await supabase
      .from('about_content')
      .update(content)
      .eq('id', content.id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Criar conteúdo sobre
  async createContent(content) {
    const { data, error } = await supabase
      .from('about_content')
      .insert([content])
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

