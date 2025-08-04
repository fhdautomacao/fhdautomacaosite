import { supabase } from '../lib/supabase'

export const authAPI = {
  // Login
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return data
  },

  // Logout
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Obter usuário atual
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  // Obter sessão atual
  async getCurrentSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  },

  // Escutar mudanças de autenticação
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  },

  // Registrar novo usuário (apenas para admin)
  async signUp(email, password, userData = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    
    if (error) throw error
    return data
  },

  // Resetar senha
  async resetPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) throw error
  },

  // Atualizar senha
  async updatePassword(newPassword) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })
    if (error) throw error
  }
}

