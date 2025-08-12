import { supabase } from '../lib/supabase'

export const productsAPI = {
  // Buscar todos os produtos
  async getAll() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('display_order', { ascending: true })
    
    if (error) {
      console.error('❌ Erro ao buscar produtos:', error)
      throw error
    }
    
    return data
  },

  // Buscar produto por ID
  async getById(id) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Criar novo produto
  async create(product) {
    console.log('🔧 productsAPI.create(): Criando produto...')
    console.log('📝 Dados do produto:', product)
    
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single()
    
    if (error) {
      console.error('❌ Erro ao criar produto:', error)
      throw error
    }
    
    console.log('✅ Produto criado com sucesso:', data.id)
    return data
  },

  // Atualizar produto
  async update(id, updates) {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Deletar produto
  async delete(id) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Upload de imagem para o storage
  async uploadImage(file) {
    console.log('📤 productsAPI.uploadImage(): Iniciando upload...')
    
    // Verificar autenticação antes do upload
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      console.log('⚠️ Usuário não autenticado no Supabase, tentando renovar sessão...')
      
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession()
      
      if (refreshError || !refreshData.session) {
        throw new Error('Sessão Supabase expirada. Faça login novamente.')
      }
      
      console.log('✅ Sessão Supabase renovada')
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `products/${fileName}`

    console.log('📤 Upload para bucket arquivos:', filePath)

    const { data, error } = await supabase.storage
      .from('arquivos')
      .upload(filePath, file)

    if (error) {
      console.error('❌ Erro no upload:', error)
      throw new Error(`Erro no upload da imagem: ${error.message}`)
    }

    console.log('✅ Upload concluído:', data)

    const { data: { publicUrl } } = supabase.storage
      .from('arquivos')
      .getPublicUrl(filePath)

    console.log('🔗 URL pública gerada:', publicUrl)
    return publicUrl
  }
}

