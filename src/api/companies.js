import { supabase } from '../lib/supabase'

export const companiesAPI = {
  // Criar nova empresa
  async create(companyData) {
    const { data, error } = await supabase
      .from('companies')
      .insert([companyData])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Buscar todas as empresas
  async getAll() {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('name')

    if (error) throw error
    return data
  },

  // Buscar empresas ativas
  async getActive() {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('status', 'active')
      .order('name')

    if (error) throw error
    return data
  },

  // Buscar empresa por ID
  async getById(id) {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Atualizar empresa
  async update(id, updates) {
    const { data, error } = await supabase
      .from('companies')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Deletar empresa
  async delete(id) {
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Buscar empresas por status
  async getByStatus(status) {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('status', status)
      .order('name')

    if (error) throw error
    return data
  },

  // Contar empresas por status
  async getCountByStatus(status) {
    const { count, error } = await supabase
      .from('companies')
      .select('*', { count: 'exact', head: true })
      .eq('status', status)

    if (error) throw error
    return count
  },

  // Buscar empresa por CNPJ
  async getByCnpj(cnpj) {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('cnpj', cnpj)
      .single()

    if (error) throw error
    return data
  }
} 