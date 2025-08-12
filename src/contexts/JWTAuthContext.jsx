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
      
      console.log('🔗 Tentando login na URL:', `${API_BASE_URL}/auth?action=login`)
      
      const response = await fetch(`${API_BASE_URL}/auth?action=login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': window.location.origin
        },
        body: JSON.stringify({ email, password })
      })

      console.log('📡 Resposta do login:', {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText
      })

      // Verificar se a resposta é JSON
      const contentType = response.headers.get('content-type')
      console.log('📄 Content-Type da resposta:', contentType)

      let data
      try {
        const responseText = await response.text()
        console.log('📄 Resposta bruta:', responseText)
        
        if (contentType && contentType.includes('application/json')) {
          data = JSON.parse(responseText)
        } else {
          throw new Error(`Resposta não é JSON válido. Content-Type: ${contentType}`)
        }
      } catch (parseError) {
        console.error('❌ Erro ao fazer parse da resposta:', parseError)
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
        console.log('🔐 Autenticando no Supabase Auth...')
        const { data: supabaseData, error: supabaseError } = await supabase.auth.signInWithPassword({
          email,
          password
        })

        if (supabaseError) {
          console.error('❌ Erro na autenticação Supabase:', supabaseError)
          throw new Error('Erro na autenticação do banco de dados')
        }

        if (supabaseData?.user) {
          console.log('✅ Autenticação Supabase bem-sucedida:', supabaseData.user.email)
          // Salvar token de sessão do Supabase
          localStorage.setItem('supabase_session', JSON.stringify(supabaseData.session))
        }
        
        // Verificar permissões do usuário
        checkUserPermissions(userData.email)
        
        // Atualizar estado
        setUser(userData)
        setToken(authToken)
        setTokenExpiry(new Date(expiresAt))
        
        console.log('✅ Login JWT + Supabase bem-sucedido:', userData.email)
        toast.success('Login realizado com sucesso!')
        
        return data.data
      } else {
        throw new Error(data.error || 'Erro no login')
      }
    } catch (error) {
      console.error('❌ Erro no login JWT:', error)
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
      console.log('🔐 Fazendo logout do Supabase Auth...')
      const { error: supabaseError } = await supabase.auth.signOut()
      
      if (supabaseError) {
        console.error('❌ Erro no logout Supabase:', supabaseError)
      } else {
        console.log('✅ Logout Supabase realizado')
      }
    } catch (error) {
      console.error('❌ Erro ao fazer logout do Supabase:', error)
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
    
    console.log('✅ Logout JWT + Supabase realizado')
    toast.success('Logout realizado com sucesso!')
    
    // Redirecionar para login apenas se o Router estiver pronto
    if (isRouterReady) {
      navigate('/admin/login')
    } else {
      // Fallback para window.location se o Router não estiver pronto
      window.location.href = '/admin/login'
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
        console.error('❌ Erro na resposta:', data.error)
        throw new Error(data.error || 'Token inválido')
      }

      const isValid = data.success && data.data.valid
      return isValid
    } catch (error) {
      console.error('❌ Erro na verificação do token:', error)
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
        
        console.log('✅ Token JWT renovado')
        return true
      } else {
        throw new Error(data.error || 'Erro na renovação do token')
      }
    } catch (error) {
      console.error('❌ Erro na renovação do token:', error)
      return false
    }
  }, [API_BASE_URL])

  // Função para verificar se o token está próximo de expirar
  const isTokenExpiringSoon = useCallback(() => {
    if (!tokenExpiry) return false
    
    const now = new Date()
    const timeUntilExpiry = tokenExpiry.getTime() - now.getTime()
    const fiveMinutes = 5 * 60 * 1000 // 5 minutos
    
    return timeUntilExpiry < fiveMinutes
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
      console.log('🔄 Inicialização já em andamento, ignorando...')
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
      

      
      // Verificar se o token expirou
      if (new Date() > expiryDate) {

        logout()
        toast.error('Sessão expirada. Faça login novamente.')
        return
      }
      
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
      
      // Verificar se o token está próximo de expirar
      const timeUntilExpiry = expiryDate.getTime() - new Date().getTime()
      const fiveMinutes = 5 * 60 * 1000
      

      
      if (timeUntilExpiry < fiveMinutes) {

        const refreshed = await refreshToken(storedToken)
        
        if (!refreshed) {

          logout()
          toast.error('Sessão expirada. Faça login novamente.')
          return
        }
      } else {

        // Verificar se o token ainda é válido
        const isValid = await verifyToken(storedToken)
        

        
        if (!isValid) {

          logout()
          toast.error('Sessão inválida. Faça login novamente.')
          return
        }
        
        // Atualizar estado
        setUser(userData)
        setToken(storedToken)
        setTokenExpiry(expiryDate)
        checkUserPermissions(userData.email)
      }
      
      
    } catch (error) {
      console.error('❌ Erro na inicialização da autenticação:', error)
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
  }, []) // Removida dependência de initializeAuth

  // Verificar expiração do token periodicamente
  useEffect(() => {
    if (!token || !tokenExpiry) return

    const checkExpiry = () => {
      if (new Date() > tokenExpiry) {
        console.log('❌ Token JWT expirado durante verificação periódica')
        logout()
        toast.error('Sessão expirada. Faça login novamente.')
        return
      }

      const timeUntilExpiry = tokenExpiry.getTime() - new Date().getTime()
      const fiveMinutes = 5 * 60 * 1000
      
      if (timeUntilExpiry < fiveMinutes) {
        console.log('⚠️ Token JWT próximo de expirar, renovando...')
        refreshToken(token).then(refreshed => {
          if (!refreshed) {
            console.log('❌ Falha na renovação automática do token')
            logout()
            toast.error('Sessão expirada. Faça login novamente.')
          }
        })
      }
    }

    // Verificar a cada minuto
    const interval = setInterval(checkExpiry, 60000)
    
    return () => clearInterval(interval)
  }, [token, tokenExpiry, refreshToken, logout])

  // Função para obter headers de autenticação
  const getAuthHeaders = useCallback(() => {
    if (!token) return {}
    
    return {
      'Authorization': `Bearer ${token}`,
      'X-Admin-Request': 'true'
    }
  }, [token])

  // Calcular isAuthenticated diretamente
  const isAuthenticated = !!user && !!token && !isTokenExpired()

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
