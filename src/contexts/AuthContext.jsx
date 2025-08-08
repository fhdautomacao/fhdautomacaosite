import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { checkPasswordBreach, validatePasswordStrength } from '../utils/passwordSecurity'

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

  const signUp = async (email, password, userData = {}) => {
    try {
      // Validar força da senha
      const passwordValidation = validatePasswordStrength(password)
      if (!passwordValidation.isValid) {
        throw new Error(`Senha fraca: ${passwordValidation.errors.join(', ')}`)
      }

      // Verificar se a senha foi comprometida
      const isBreached = await checkPasswordBreach(password)
      if (isBreached) {
        throw new Error('Esta senha foi comprometida em vazamentos de dados. Por favor, escolha uma senha diferente.')
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      })

      if (error) {
        console.error('Erro no registro:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Erro ao registrar usuário:', error)
      throw error
    }
  }

  const updatePassword = async (newPassword) => {
    try {
      // Validar força da senha
      const passwordValidation = validatePasswordStrength(newPassword)
      if (!passwordValidation.isValid) {
        throw new Error(`Senha fraca: ${passwordValidation.errors.join(', ')}`)
      }

      // Verificar se a senha foi comprometida
      const isBreached = await checkPasswordBreach(newPassword)
      if (isBreached) {
        throw new Error('Esta senha foi comprometida em vazamentos de dados. Por favor, escolha uma senha diferente.')
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        console.error('Erro ao atualizar senha:', error)
        throw error
      }
    } catch (error) {
      console.error('Erro ao atualizar senha:', error)
      throw error
    }
  }

  const value = {
    user,
    loading,
    login,
    logout,
    signUp,
    updatePassword,
    userPermissions,
    validatePasswordStrength,
    checkPasswordBreach
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

