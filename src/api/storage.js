import { supabase } from '../lib/supabase'

export const storageAPI = {
  // Upload de arquivo
  async uploadFile(file, path) {
    try {
      const { data, error } = await supabase.storage
        .from('arquivos')
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false
        })
      
      if (error) {
        console.error('Erro no upload:', error)
        throw error
      }
      
      return data
    } catch (error) {
      console.error('Erro completo no upload:', error)
      throw error
    }
  },

  // Obter URL pública do arquivo
  getPublicUrl(path) {
    const { data } = supabase.storage
      .from('arquivos')
      .getPublicUrl(path)
    
    return data.publicUrl
  },

  // Deletar arquivo
  async deleteFile(path) {
    const { error } = await supabase.storage
      .from('arquivos')
      .remove([path])
    
    if (error) throw error
    return true
  },

  // Listar arquivos
  async listFiles(folder = '') {
    const { data, error } = await supabase.storage
      .from('arquivos')
      .list(folder)
    
    if (error) throw error
    return data
  },

  // Download de arquivo
  async downloadFile(path) {
    const { data, error } = await supabase.storage
      .from('arquivos')
      .download(path)
    
    if (error) throw error
    return data
  },

  // Atualizar arquivo
  async updateFile(file, path) {
    const { data, error } = await supabase.storage
      .from('arquivos')
      .update(path, file)
    
    if (error) throw error
    return data
  }
}

