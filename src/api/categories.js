import { supabase } from '@/lib/supabase'

export const categoriesAPI = {
  // Buscar todas as categorias por tipo
  getByType: async (type) => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('type', type)
      .order('name', { ascending: true })

    if (error) throw error
    return data
  },

  // Buscar todas as categorias
  getAll: async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('type', { ascending: true })
      .order('name', { ascending: true })

    if (error) throw error
    return data
  },

  // Criar nova categoria
  create: async (categoryData) => {
    const { data, error } = await supabase
      .from('categories')
      .insert([categoryData])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Atualizar categoria
  update: async (id, categoryData) => {
    const { data, error } = await supabase
      .from('categories')
      .update(categoryData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Deletar categoria
  delete: async (id) => {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  }
}

