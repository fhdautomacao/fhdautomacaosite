import { supabase } from '../lib/supabase'

export const productsAPI = {
  // Buscar todos os produtos
  async getAll() {
    console.log('🔍 productsAPI.getAll(): Iniciando busca...')
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('display_order', { ascending: true })
    
    if (error) {
      console.error('❌ Erro ao buscar produtos:', error)
      throw error
    }
    
    console.log('✅ Produtos carregados:', data?.length || 0)
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
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `products/${fileName}`

    const { data, error } = await supabase.storage
      .from('images')
      .upload(filePath, file)

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath)

    return publicUrl
  }
}

