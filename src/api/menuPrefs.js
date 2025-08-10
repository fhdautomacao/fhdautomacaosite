import { supabase } from '../lib/supabase'

export const menuPrefsAPI = {
  async list() {
    const { data, error } = await supabase
      .from('user_menu_prefs')
      .select('*')
    if (error) throw error
    return data
  },

  async getMap() {
    const rows = await this.list()
    const map = {}
    rows.forEach(r => { map[r.section_id] = r.is_visible })
    return map
  },

  async setVisibility(sectionId, isVisible, userId = null) {
    // Se userId não for fornecido, tentar obter do localStorage (JWT)
    if (!userId) {
      const storedUser = localStorage.getItem('jwt_user')
      if (storedUser) {
        const userData = JSON.parse(storedUser)
        userId = userData.id
      }
    }
    
    if (!userId) {
      throw new Error('Not authenticated')
    }
    
    const { data, error } = await supabase
      .from('user_menu_prefs')
      .upsert({ user_id: userId, section_id: sectionId, is_visible: !!isVisible }, { onConflict: 'user_id,section_id' })
      .select()
      .single()
    if (error) throw error
    return data
  }
}


