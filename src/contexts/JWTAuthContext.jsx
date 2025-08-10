import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { getApiUrl } from '@/lib/urls-config'

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
      // Permissões gerais
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

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro no login')
      }

      if (data.success) {
        const { user: userData, token: authToken, expiresAt } = data.data
        
        // Salvar no localStorage
        localStorage.setItem('jwt_token', authToken)
        localStorage.setItem('jwt_user', JSON.stringify(userData))
        localStorage.setItem('jwt_expires_at', expiresAt)
        
        // Verificar permissões do usuário
        checkUserPermissions(userData.email)
        
        // Atualizar estado
        setUser(userData)
        setToken(authToken)
        setTokenExpiry(new Date(expiresAt))
        
        console.log('✅ Login JWT bem-sucedido:', userData.email)
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
  const logout = useCallback(() => {
    // Limpar localStorage
    localStorage.removeItem('jwt_token')
    localStorage.removeItem('jwt_user')
    localStorage.removeItem('jwt_expires_at')
    
    // Limpar estado
    setUser(null)
    setToken(null)
    setTokenExpiry(null)
    setUserPermissions({})
    
    console.log('✅ Logout JWT realizado')
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
        throw new Error(data.error || 'Token inválido')
      }

      return data.success && data.data.valid
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
      return
    }
    
    try {
      setLoading(true)
      isInitialized.current = true
      
      // Recuperar dados do localStorage
      const storedToken = localStorage.getItem('jwt_token')
      const storedUser = localStorage.getItem('jwt_user')
      const storedExpiresAt = localStorage.getItem('jwt_expires_at')
      
      if (!storedToken || !storedUser || !storedExpiresAt) {
        console.log('⚠️ Nenhum token JWT encontrado')
        setLoading(false)
        return
      }
      
      const userData = JSON.parse(storedUser)
      const expiryDate = new Date(storedExpiresAt)
      
      // Verificar se o token expirou
      if (new Date() > expiryDate) {
        console.log('❌ Token JWT expirado')
        logout()
        toast.error('Sessão expirada. Faça login novamente.')
        return
      }
      
      // Verificar se o token está próximo de expirar
      const timeUntilExpiry = expiryDate.getTime() - new Date().getTime()
      const fiveMinutes = 5 * 60 * 1000
      
      if (timeUntilExpiry < fiveMinutes) {
        console.log('⚠️ Token JWT próximo de expirar, tentando renovar...')
        const refreshed = await refreshToken(storedToken)
        
        if (!refreshed) {
          console.log('❌ Falha na renovação do token')
          logout()
          toast.error('Sessão expirada. Faça login novamente.')
          return
        }
      } else {
        // Verificar se o token ainda é válido
        const isValid = await verifyToken(storedToken)
        
        if (!isValid) {
          console.log('❌ Token JWT inválido')
          logout()
          toast.error('Sessão inválida. Faça login novamente.')
          return
        }
        
        // Atualizar estado
        setUser(userData)
        setToken(storedToken)
        setTokenExpiry(expiryDate)
      }
      
      console.log('✅ Autenticação JWT inicializada')
    } catch (error) {
      console.error('❌ Erro na inicialização da autenticação:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }, [logout, refreshToken, verifyToken])

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
