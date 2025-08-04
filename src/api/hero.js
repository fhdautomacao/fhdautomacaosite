import { supabase } from '../lib/supabase'

export const heroAPI = {
  // Buscar conteúdo hero
  async getContent() {
    const { data, error } = await supabase
      .from('hero_content')
      .select(`
        *,
        hero_stats(*),
        hero_features(*)
      `)
      .eq('is_visible', true);

    if (error) throw error;
    return data;
  },

  // Atualizar conteúdo hero
  async updateContent(id, updates) {
    const { data, error } = await supabase
      .from('hero_content')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Criar conteúdo hero
  async createContent(content) {
    const { data, error } = await supabase
      .from('hero_content')
      .insert([content])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Buscar estatísticas do hero
  async getStats(heroId) {
    const { data, error } = await supabase
      .from('hero_stats')
      .select('*')
      .eq('hero_id', heroId)
      .order('display_order', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Criar estatística do hero
  async createStat(stat) {
    const { data, error } = await supabase
      .from('hero_stats')
      .insert([stat])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Atualizar estatística do hero
  async updateStat(id, updates) {
    const { data, error } = await supabase
      .from('hero_stats')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Deletar estatística do hero
  async deleteStat(id) {
    const { error } = await supabase
      .from('hero_stats')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Buscar características do hero
  async getFeatures(heroId) {
    const { data, error } = await supabase
      .from('hero_features')
      .select('*')
      .eq('hero_id', heroId)
      .order('display_order', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Criar característica do hero
  async createFeature(feature) {
    const { data, error } = await supabase
      .from('hero_features')
      .insert([feature])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Atualizar característica do hero
  async updateFeature(id, updates) {
    const { data, error } = await supabase
      .from('hero_features')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Deletar característica do hero
  async deleteFeature(id) {
    const { error } = await supabase
      .from('hero_features')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

