import { supabase } from '../lib/supabase'

export const seoAPI = {
  // Buscar configurações SEO por página
  async getByPage(pagePath) {
    const { data, error } = await supabase
      .from('seo_settings')
      .select('*')
      .eq('page_path', pagePath)
      .single()
    
    if (error) throw error
    return data
  },

  // Buscar todas as configurações SEO
  async getAll() {
    const { data, error } = await supabase
      .from('seo_settings')
      .select('*')
      .order('page_path')
    
    if (error) throw error
    return data
  },

  // Atualizar configurações SEO
  async update(pagePath, settings) {
    const { data, error } = await supabase
      .from('seo_settings')
      .upsert([{ page_path: pagePath, ...settings }])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Criar configurações SEO
  async create(settings) {
    const { data, error } = await supabase
      .from('seo_settings')
      .insert([settings])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Deletar configurações SEO
  async delete(pagePath) {
    const { error } = await supabase
      .from('seo_settings')
      .delete()
      .eq('page_path', pagePath)
    
    if (error) throw error
    return true
  }
}

export const siteSettingsAPI = {
  // Buscar configuração por chave
  async getBySetting(settingKey) {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('setting_key', settingKey)
      .single()
    
    if (error) throw error
    return data
  },

  // Buscar todas as configurações
  async getAll() {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .order('setting_key')
    
    if (error) throw error
    return data
  },

  // Atualizar configuração
  async update(settingKey, value, type = 'text') {
    const { data, error } = await supabase
      .from('site_settings')
      .upsert([{ 
        setting_key: settingKey, 
        setting_value: value,
        setting_type: type 
      }])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Atualizar múltiplas configurações
  async updateMultiple(settings) {
    const settingsArray = Object.entries(settings).map(([key, value]) => ({
      setting_key: key,
      setting_value: typeof value === 'object' ? JSON.stringify(value) : value,
      setting_type: typeof value === 'object' ? 'json' : 'text'
    }))

    const { data, error } = await supabase
      .from('site_settings')
      .upsert(settingsArray)
      .select()
    
    if (error) throw error
    return data
  }
}

