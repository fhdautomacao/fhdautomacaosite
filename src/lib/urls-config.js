// Configuração centralizada de URLs do projeto FHD Automação
// Este arquivo facilita a manutenção e atualização de URLs

export const URLS_CONFIG = {
  // URLs de Desenvolvimento
  development: {
    frontend: 'http://localhost:5173',
    frontendAlt: 'http://localhost:3000',
    api: 'http://localhost:3001'
  },

  // URLs de Produção
  production: {
    // URL antiga (mantida para compatibilidade)
    old: {
      main: 'https://fhd-automacao-industrial-bq67.vercel.app',
      admin: 'https://fhd-automacao-industrial-bq67.vercel.app/admin',
      api: 'https://fhd-automacao-industrial-bq67.vercel.app/api'
    },
    // Nova URL principal
    new: {
      main: 'https://fhdautomacaoindustrialapp.vercel.app',
      admin: 'https://fhdautomacaoindustrialapp.vercel.app/admin',
      api: 'https://fhdautomacaoindustrialapp.vercel.app/api'
    }
  }
}

// Função para obter a URL principal baseada no ambiente
export const getMainUrl = () => {
  if (import.meta.env.DEV) {
    return URLS_CONFIG.development.frontend
  }
  
  // Em produção, usar a nova URL como padrão
  return URLS_CONFIG.production.new.main
}

// Função para obter a URL da API baseada no ambiente
export const getApiUrl = () => {
  if (import.meta.env.DEV) {
    return URLS_CONFIG.development.api
  }
  
  // Em produção, usar a nova URL da API como padrão
  return URLS_CONFIG.production.new.api
}

// Função para obter a URL admin baseada no ambiente
export const getAdminUrl = () => {
  if (import.meta.env.DEV) {
    return `${URLS_CONFIG.development.frontend}/admin`
  }
  
  // Em produção, usar a nova URL admin como padrão
  return URLS_CONFIG.production.new.admin
}

// Lista de todas as origens permitidas para CORS
export const getAllowedOrigins = () => {
  const origins = [
    // Desenvolvimento
    URLS_CONFIG.development.frontend,
    URLS_CONFIG.development.frontendAlt,
    
    // Produção - URLs antigas (mantidas para compatibilidade)
    URLS_CONFIG.production.old.main,
    URLS_CONFIG.production.old.admin,
    
    // Produção - URLs novas
    URLS_CONFIG.production.new.main,
    URLS_CONFIG.production.new.admin,
    
    // URLs do ambiente (se configuradas)
    import.meta.env.VITE_APP_URL,
    import.meta.env.NEXT_PUBLIC_APP_URL
  ].filter(Boolean) // Remove valores undefined/null

  return origins
}

// Função para verificar se uma URL é permitida
export const isAllowedOrigin = (origin) => {
  const allowedOrigins = getAllowedOrigins()
  return allowedOrigins.includes(origin) || 
         allowedOrigins.some(allowed => origin.startsWith(allowed))
}

// Configuração para diferentes ambientes
export const getEnvironmentConfig = () => {
  if (import.meta.env.DEV) {
    return {
      name: 'development',
      urls: URLS_CONFIG.development,
      isProduction: false
    }
  }
  
  return {
    name: 'production',
    urls: URLS_CONFIG.production,
    isProduction: true
  }
}

// Exportar configuração completa
export default {
  URLS_CONFIG,
  getMainUrl,
  getApiUrl,
  getAdminUrl,
  getAllowedOrigins,
  isAllowedOrigin,
  getEnvironmentConfig
}
