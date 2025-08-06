import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userPermissions, setUserPermissions] = useState({
    canAccessQuotations: false,
    canAccessBills: false,
    isAdmin: false
  })

  useEffect(() => {
    // Verificar sessão atual
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        checkUserPermissions(session.user.email)
      }
      setLoading(false)
    }

    getSession()

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user)
          checkUserPermissions(session.user.email)
        } else {
          setUser(null)
          setUserPermissions({
            canAccessQuotations: false,
            canAccessBills: false,
            isAdmin: false
          })
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, []) // Mantendo array vazio para evitar loops

  const checkUserPermissions = (email) => {
    if (!email) return

    const permissions = {
      canAccessQuotations: false,
      canAccessBills: false,
      isAdmin: false
    }

    // adminfhd@fhd.com tem acesso total
    if (email === 'adminfhd@fhd.com') {
      permissions.canAccessQuotations = true
      permissions.canAccessBills = true
      permissions.isAdmin = true
    }
    // fhduser@fhd.com tem acesso limitado
    else if (email === 'fhduser@fhd.com') {
      permissions.canAccessQuotations = false
      permissions.canAccessBills = false
      permissions.isAdmin = false
    }

    setUserPermissions(permissions)
  }

  const login = async (email, password) => {
    try {
      console.log('Tentando fazer login com:', { email, password: '***' })
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.error('Erro no login:', error)
        throw error
      }

      console.log('Login bem-sucedido:', data.user.email)
      console.log('Dados completos do login:', data)
      
      // Forçar atualização do estado
      setUser(data.user)
      checkUserPermissions(data.user.email)
      
      return data
    } catch (error) {
      console.error('Erro ao fazer login:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Erro ao fazer logout:', error)
        throw error
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      throw error
    }
  }

  const value = {
    user,
    loading,
    login,
    logout,
    userPermissions
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

