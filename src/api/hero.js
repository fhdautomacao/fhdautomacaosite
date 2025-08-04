import { supabase } from '../lib/supabase'

export const heroAPI = {
  // Buscar conteúdo do hero
  async getContent() {
    const { data, error } = await supabase
      .from('hero_content')
      .select(`
        *,
        hero_stats(*),
        hero_features(*)
      `)
      .single()
    
    if (error) throw error
    return data
  },

  // Atualizar conteúdo do hero
  async updateContent(content) {
    const { data, error } = await supabase
      .from('hero_content')
      .update(content)
      .eq('id', content.id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Criar novo conteúdo do hero
  async createContent(content) {
    const { data, error } = await supabase
      .from('hero_content')
      .insert([content])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Gerenciar estatísticas do hero
  async updateStats(heroId, stats) {
    // Primeiro, deletar estatísticas existentes
    await supabase
      .from('hero_stats')
      .delete()
      .eq('hero_id', heroId)

    // Inserir novas estatísticas
    const statsArray = Object.entries(stats).map(([key, value], index) => ({
      hero_id: heroId,
      stat_key: key,
      value: value.value,
      label: value.label,
      display_order: index
    }))

    const { data, error } = await supabase
      .from('hero_stats')
      .insert(statsArray)
      .select()
    
    if (error) throw error
    return data
  },

  // Gerenciar características do hero
  async updateFeatures(heroId, features) {
    // Primeiro, deletar características existentes
    await supabase
      .from('hero_features')
      .delete()
      .eq('hero_id', heroId)

    // Inserir novas características
    const featuresArray = features.map((feature, index) => ({
      hero_id: heroId,
      icon: feature.icon,
      title: feature.title,
      description: feature.description,
      display_order: index
    }))

    const { data, error } = await supabase
      .from('hero_features')
      .insert(featuresArray)
      .select()
    
    if (error) throw error
    return data
  }
}

