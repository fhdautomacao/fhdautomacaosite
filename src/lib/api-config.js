// Configuração para chamadas de API com autenticação CORS
import { getApiUrl } from './urls-config'

const API_BASE_URL = import.meta.env.VITE_API_URL || getApiUrl()

// Função para verificar se estamos na página admin
export const isAdminPage = () => {
  return window.location.pathname.includes('/admin')
}

// Função para obter headers de autenticação
export const getAuthHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
    'Origin': window.location.origin
  }

  // Se estamos na página admin, adicionar header de identificação
  if (isAdminPage()) {
    headers['X-Admin-Request'] = 'true'
    
    // Adicionar token JWT se disponível
    const token = localStorage.getItem('jwt_token')
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }

  return headers
}

// Função para fazer requisições HTTP com configuração adequada
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  
  const config = {
    method: 'GET',
    headers: getAuthHeaders(),
    credentials: 'include', // Incluir cookies se necessário
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers
    }
  }

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Erro HTTP: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Erro na requisição API:', error)
    throw error
  }
}

// Funções específicas para SEO Settings
export const seoApi = {
  // Buscar configurações de SEO
  getSettings: (pageName = null, id = null) => {
    const params = new URLSearchParams()
    if (pageName) params.append('page_name', pageName)
    if (id) params.append('id', id)
    
    return apiRequest(`/seo-settings?${params.toString()}`)
  },

  // Criar/atualizar configuração
  saveSettings: (seoData) => {
    return apiRequest('/seo-settings', {
      method: 'POST',
      body: JSON.stringify(seoData)
    })
  },

  // Atualizar configuração específica
  updateSettings: (id, seoData) => {
    return apiRequest(`/seo-settings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(seoData)
    })
  },

  // Deletar configuração
  deleteSettings: (id) => {
    return apiRequest(`/seo-settings/${id}`, {
      method: 'DELETE'
    })
  },

  // Health check
  healthCheck: () => {
    return apiRequest('/health')
  }
}

// Função para configurar autenticação admin
export const setupAdminAuth = (token) => {
  if (token) {
    localStorage.setItem('adminToken', token)
  } else {
    localStorage.removeItem('adminToken')
  }
}

// Função para verificar se o usuário está autenticado como admin
export const isAdminAuthenticated = () => {
  return isAdminPage() && localStorage.getItem('adminToken')
}

export default {
  API_BASE_URL,
  isAdminPage,
  getAuthHeaders,
  apiRequest,
  seoApi,
  setupAdminAuth,
  isAdminAuthenticated
}
