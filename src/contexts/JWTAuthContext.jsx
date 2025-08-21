import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { getApiUrl } from '@/lib/urls-config'
import { supabase } from '@/lib/supabase'

const JWTAuthContext = createContext()

export const useJWTAuth = () => {
  const context = useContext(JWTAuthContext)
  if (!context) {
    throw new Error('useJWTAuth must be used within a JWTAuthProvider')
  }
  return context
}

export const JWTAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tokenExpiry, setTokenExpiry] = useState(null)
  const [isRouterReady, setIsRouterReady] = useState(false)
  const [userPermissions, setUserPermissions] = useState({})
  const navigate = useNavigate()
  const isInitialized = useRef(false)

  // Marcar que o Router está pronto
  useEffect(() => {
    setIsRouterReady(true)
  }, [])

  // API base URL - usar a função getApiUrl que detecta automaticamente o ambiente
  const API_BASE_URL = getApiUrl()

  // Função para verificar permissões do usuário
  const checkUserPermissions = useCallback((email) => {
    const isAdmin = email === 'adminfhd@fhd.com'
    const isUser = email === 'fhduser@fhd.com'
    
    const permissions = {
      // Permissões gerais - Admin tem acesso total
      canAccessDashboard: isAdmin,
      canAccessBills: isAdmin,
      canAccessProfitSharing: isAdmin,
      canAccessCompanies: isAdmin,
      canAccessSEO: isAdmin,
      
      // Permissões específicas
      canAccessQuotations: true, // Ambos podem acessar
      canAccessClients: true, // Ambos podem acessar
      canAccessProducts: true, // Ambos podem acessar
      canAccessGallery: true, // Ambos podem acessar
      canAccessServices: true, // Ambos podem acessar
      canAccessCosts: isAdmin,
      
      // Permissões de administração
      isAdmin: isAdmin,
      isUser: isUser
    }
    

    
    setUserPermissions(permissions)
    return permissions
  }, [])

  // Função para fazer login
  const login = useCallback(async (email, password) => {
    try {
      setLoading(true)
      
      const response = await fetch(`${API_BASE_URL}/auth?action=login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': window.location.origin
        },
        body: JSON.stringify({ email, password })
      })

      // Verificar se a resposta é JSON
      const contentType = response.headers.get('content-type')

      let data
      try {
        const responseText = await response.text()
        
        if (contentType && contentType.includes('application/json')) {
          data = JSON.parse(responseText)
        } else {
          throw new Error(`Resposta não é JSON válido. Content-Type: ${contentType}`)
        }
      } catch (parseError) {
        throw new Error('Erro na resposta do servidor. Verifique se a API está funcionando.')
      }

      if (!response.ok) {
        throw new Error(data.error || 'Erro no login')
      }

      if (data.success) {
        const { user: userData, token: authToken, expiresAt } = data.data
        
        // Salvar no localStorage
        localStorage.setItem('jwt_token', authToken)
        localStorage.setItem('jwt_user', JSON.stringify(userData))
        localStorage.setItem('jwt_expires_at', expiresAt)
        
        // Autenticar no Supabase Auth para contornar RLS
        const { data: supabaseData, error: supabaseError } = await supabase.auth.signInWithPassword({
          email,
          password
        })

        if (supabaseError) {
          throw new Error('Erro na autenticação do banco de dados')
        }

        if (supabaseData?.user) {
          // Salvar token de sessão do Supabase
          localStorage.setItem('supabase_session', JSON.stringify(supabaseData.session))
        }
        
        // Verificar permissões do usuário
        checkUserPermissions(userData.email)
        
        // Atualizar estado
        setUser(userData)
        setToken(authToken)
        const expiryDate = new Date(expiresAt)
        setTokenExpiry(expiryDate)
        
        toast.success('Login realizado com sucesso!')
        
        return data.data
      } else {
        throw new Error(data.error || 'Erro no login')
      }
    } catch (error) {
      toast.error(error.message || 'Erro ao fazer login')
      throw error
    } finally {
      setLoading(false)
    }
  }, [API_BASE_URL, checkUserPermissions])

  // Função para fazer logout
  const logout = useCallback(async () => {
    try {
      // Fazer logout do Supabase Auth
      const { error: supabaseError } = await supabase.auth.signOut()
      
      if (supabaseError) {
        console.error('Erro no logout Supabase:', supabaseError)
      }
    } catch (error) {
      console.error('Erro ao fazer logout do Supabase:', error)
    }

    // Limpar localStorage
    localStorage.removeItem('jwt_token')
    localStorage.removeItem('jwt_user')
    localStorage.removeItem('jwt_expires_at')
    localStorage.removeItem('supabase_session')
    
    // Limpar estado
    setUser(null)
    setToken(null)
    setTokenExpiry(null)
    setUserPermissions({})
    
    toast.success('Logout realizado com sucesso!')
    
    // Redirecionar para login apenas se o Router estiver pronto
    if (isRouterReady) {
      navigate('/login-admin')
    } else {
      // Fallback para window.location se o Router não estiver pronto
      window.location.href = '/login-admin'
    }
  }, [navigate, isRouterReady])

  // Função para verificar token
  const verifyToken = useCallback(async (authToken) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth?action=verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
          'Origin': window.location.origin
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Token inválido')
      }

      const isValid = data.success && data.data.valid
      return isValid
    } catch (error) {
      return false
    }
  }, [API_BASE_URL])

  // Função para renovar token
  const refreshToken = useCallback(async (authToken) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth?action=refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
          'Origin': window.location.origin
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro na renovação do token')
      }

      if (data.success) {
        const { user: userData, token: newToken, expiresAt } = data.data
        
        // Atualizar localStorage
        localStorage.setItem('jwt_token', newToken)
        localStorage.setItem('jwt_user', JSON.stringify(userData))
        localStorage.setItem('jwt_expires_at', expiresAt)
        
        // Atualizar estado
        setUser(userData)
        setToken(newToken)
        setTokenExpiry(new Date(expiresAt))
        
        return true
      } else {
        throw new Error(data.error || 'Erro na renovação do token')
      }
    } catch (error) {
      return false
    }
  }, [API_BASE_URL])

  // Função para verificar se o token está próximo de expirar
  const isTokenExpiringSoon = useCallback(() => {
    if (!tokenExpiry) return false
    
    const now = new Date()
    const timeUntilExpiry = tokenExpiry.getTime() - now.getTime()
    const tenMinutes = 10 * 60 * 1000 // 10 minutos (aumentado para dar mais tempo)
    
    return timeUntilExpiry < tenMinutes
  }, [tokenExpiry])

  // Função para verificar se o token expirou
  const isTokenExpired = useCallback(() => {
    if (!tokenExpiry) return true
    
    const now = new Date()
    return now > tokenExpiry
  }, [tokenExpiry])

  // Função para inicializar autenticação
  const initializeAuth = useCallback(async () => {
    // Evitar inicialização múltipla
    if (isInitialized.current) {
      return
    }
    
    try {
      setLoading(true)
      isInitialized.current = true
      
      // Recuperar dados do localStorage
      const storedToken = localStorage.getItem('jwt_token')
      const storedUser = localStorage.getItem('jwt_user')
      const storedExpiresAt = localStorage.getItem('jwt_expires_at')
      const storedSupabaseSession = localStorage.getItem('supabase_session')
      

      
      if (!storedToken || !storedUser || !storedExpiresAt) {
        setLoading(false)
        return
      }
      
      const userData = JSON.parse(storedUser)
      const expiryDate = new Date(storedExpiresAt)
      

      
      // Verificar se o token expirou (comentado temporariamente)
      // if (new Date() > expiryDate) {
      //   logout()
      //   toast.error('Sessão expirada. Faça login novamente.')
      //   return
      // }
      
      // Restaurar sessão do Supabase se disponível
      if (storedSupabaseSession) {
        try {
          const session = JSON.parse(storedSupabaseSession)

          
          // Verificar se a sessão do Supabase ainda é válida
          const { data: { user }, error } = await supabase.auth.getUser()
          
          if (error || !user) {

            // Tentar renovar a sessão do Supabase
            const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession()
            
            if (refreshError || !refreshData.session) {

              // Continuar apenas com JWT, mas avisar o usuário
              toast.warning('Sessão do banco de dados expirada. Algumas operações podem não funcionar.')
            } else {

              localStorage.setItem('supabase_session', JSON.stringify(refreshData.session))
            }
          } else {

          }
        } catch (error) {
          console.error('❌ Erro ao restaurar sessão Supabase:', error)
        }
      }
      
      // Verificar se o token está próximo de expirar (apenas se muito próximo)
      const timeUntilExpiry = expiryDate.getTime() - new Date().getTime()
      const oneMinute = 1 * 60 * 1000 // Apenas quando restar 1 minuto
      
      // Verificação de renovação automática (comentada temporariamente)
      // if (timeUntilExpiry < oneMinute) {
      //   const refreshed = await refreshToken(storedToken)
      //   
      //   if (!refreshed) {
      //     logout()
      //     toast.error('Sessão expirada. Faça login novamente.')
      //     return
      //   }
      // } else {

        // Verificar se o token ainda é válido (comentado temporariamente)
        // const isValid = await verifyToken(storedToken)
        
        // if (!isValid) {
        //   logout()
        //   toast.error('Sessão inválida. Faça login novamente.')
        //   return
        // }
        
        // Atualizar estado (sempre)
        setUser(userData)
        setToken(storedToken)
        setTokenExpiry(expiryDate)
        checkUserPermissions(userData.email)
      }
      
      
    } catch (error) {
      console.error('Erro na inicialização da autenticação:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }, [logout, refreshToken, verifyToken, checkUserPermissions])

  // Verificar autenticação na inicialização (apenas uma vez)
  useEffect(() => {
    if (!isInitialized.current) {
      initializeAuth()
    }
  }, [initializeAuth]) // Adicionada dependência de initializeAuth

  // Verificar expiração do token periodicamente (comentado temporariamente)
  // useEffect(() => {
  //   if (!token || !tokenExpiry) return

  //   const checkExpiry = () => {
  //     if (new Date() > tokenExpiry) {
  //       logout()
  //       toast.error('Sessão expirada. Faça login novamente.')
  //       return
  //     }

  //     const timeUntilExpiry = tokenExpiry.getTime() - new Date().getTime()
  //     const twoMinutes = 2 * 60 * 1000 // Mudado para 2 minutos
  //     
  //     if (timeUntilExpiry < twoMinutes) {
  //       refreshToken(token).then(refreshed => {
  //         if (!refreshed) {
  //           logout()
  //           toast.error('Sessão expirada. Faça login novamente.')
  //         }
  //       }).catch(() => {
  //         // Se houver erro na renovação, não fazer logout imediato
  //         console.warn('Falha na renovação automática do token')
  //         })
  //     }
  //   }

  //   // Verificar a cada minuto
  //   const interval = setInterval(checkExpiry, 60000)
  //   
  //   return () => clearInterval(interval)
  // }, [token, tokenExpiry, refreshToken, logout])

  // Função para obter headers de autenticação
  const getAuthHeaders = useCallback(() => {
    if (!token) return {}
    
    return {
      'Authorization': `Bearer ${token}`,
      'X-Admin-Request': 'true'
    }
  }, [token])

  // Calcular isAuthenticated diretamente (simplificado temporariamente)
  const isAuthenticated = !!user && !!token && !loading
  


  const value = {
    user,
    token,
    loading,
    login,
    logout,
    verifyToken,
    refreshToken,
    getAuthHeaders,
    userPermissions,
    isAuthenticated,
    isTokenExpired,
    isTokenExpiringSoon
  }

  return (
    <JWTAuthContext.Provider value={value}>
      {children}
    </JWTAuthContext.Provider>
  )
}
