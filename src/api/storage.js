import { supabase } from '../lib/supabase'
import { getApiUrl } from '../lib/urls-config'

export const storageAPI = {
  // Upload de arquivo
  async uploadFile(file, path) {
    try {
      console.log('📤 Storage: Iniciando upload para:', path)
      
      // Verificar se o usuário está autenticado via JWT
      const storedUser = localStorage.getItem('jwt_user')
      const storedToken = localStorage.getItem('jwt_token')
      
      if (!storedUser || !storedToken) {
        throw new Error('Usuário não autenticado')
      }
      
      const userData = JSON.parse(storedUser)
      console.log('👤 Storage: Usuário autenticado:', userData.email)
      
      // Tentar upload com o cliente Supabase atual
      const { data, error } = await supabase.storage
        .from('arquivos')
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false
        })
      
      if (error) {
        console.error('❌ Storage: Erro no upload:', error)
        
        // Se for erro de RLS, usar a API do servidor
        if (error.message?.includes('row-level security policy')) {
          console.log('🔄 Storage: Usando API do servidor para contornar RLS...')
          return await this.uploadViaServer(file, path, storedToken)
        }
        
        throw error
      }
      
      console.log('✅ Storage: Upload concluído:', data)
      return data
    } catch (error) {
      console.error('❌ Storage: Erro completo no upload:', error)
      throw error
    }
  },

  // Upload via API do servidor (contorna RLS)
  async uploadViaServer(file, path, token) {
    try {
      console.log('📤 Storage: Upload via servidor para:', path)
      
      const API_BASE_URL = getApiUrl()
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', path.split('/')[0]) // Extrair pasta do path
      
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro no upload via servidor')
      }
      
      const result = await response.json()
      console.log('✅ Storage: Upload via servidor concluído:', result)
      
      return {
        path: result.data.path,
        ...result.data
      }
    } catch (error) {
      console.error('❌ Storage: Erro no upload via servidor:', error)
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

