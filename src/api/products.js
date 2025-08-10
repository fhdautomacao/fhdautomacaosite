import { supabase } from '../lib/supabase'

export const productsAPI = {
  // Buscar todos os produtos
  async getAll() {
    console.log('🔍 productsAPI.getAll(): Iniciando busca...')
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('display_order', { ascending: true })
    
    console.log('📊 productsAPI.getAll(): Resultado:', {
      data: data?.length || 0,
      error: error?.message || null,
      products: data
    })
    
    if (error) {
      console.error('❌ productsAPI.getAll(): Erro:', error)
      throw error
    }
    
    console.log('✅ productsAPI.getAll(): Sucesso')
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
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single()
    
    if (error) throw error
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
      .from('arquivos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) throw error

    const { data: publicURL } = supabase.storage
      .from('arquivos')
      .getPublicUrl(filePath)

    return publicURL.publicUrl
  },

  // Buscar produtos por categoria
  async getByCategory(category) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('display_order', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Buscar produtos ativos
  async getActive() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Atualizar ordem de exibição
  async updateDisplayOrder(id, displayOrder) {
    const { data, error } = await supabase
      .from('products')
      .update({ display_order: displayOrder })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Ativar/desativar produto
  async toggleActive(id, isActive) {
    const { data, error } = await supabase
      .from('products')
      .update({ is_active: isActive })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

