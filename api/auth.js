import jwt from 'jsonwebtoken'
import { createClient } from '@supabase/supabase-js'

// Configuração JWT
const JWT_SECRET = process.env.JWT_SECRET || 'U3pZjijm9HvwB4T0uGvgXlazWT63+f2U701YmPc6i7umkChmBalYatFX+s1j/ERIbXcSWNjOqcZB5WdDWZqJzw=='
const JWT_EXPIRES_IN = '5h'

// Configuração Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

console.log('🔧 [AUTH] Configuração Supabase:', {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseKey,
  url: supabaseUrl ? 'Configurado' : 'Não configurado',
  keyLength: supabaseKey ? supabaseKey.length : 0
})

// Criar cliente Supabase
let supabase = null
try {
  if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey)
    console.log('✅ [AUTH] Cliente Supabase criado com sucesso')
  } else {
    console.error('❌ [AUTH] Supabase não configurado - URL ou Key ausentes')
    console.error('❌ [AUTH] URL:', supabaseUrl ? 'Presente' : 'Ausente')
    console.error('❌ [AUTH] Key:', supabaseKey ? 'Presente' : 'Ausente')
  }
} catch (error) {
  console.error('❌ [AUTH] Erro ao criar cliente Supabase:', error)
}

// Lista de usuários autorizados
const AUTHORIZED_USERS = [
  'adminfhd@fhd.com',
  'fhduser@fhd.com'
]

// Função para gerar token JWT personalizado
const generateCustomToken = (user) => {
  try {
    console.log('🔑 [AUTH] Gerando token para usuário:', user.email)
    
    const payload = {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || user.email,
      role: user.email === 'adminfhd@fhd.com' ? 'admin' : 'user',
      iat: Math.floor(Date.now() / 1000)
    }
    
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
    console.log('✅ [AUTH] Token gerado com sucesso')
    return token
  } catch (error) {
    console.error('❌ [AUTH] Erro ao gerar token:', error)
    throw error
  }
}

// Função para verificar token JWT
const verifyToken = (token) => {
  try {
    console.log('🔍 [AUTH] Verificando token JWT...')
    console.log('🔑 [AUTH] JWT_SECRET configurado:', !!JWT_SECRET)
    console.log('📏 [AUTH] Tamanho do token:', token.length)
    
    const decoded = jwt.verify(token, JWT_SECRET)
    console.log('✅ [AUTH] Token decodificado:', {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      iat: decoded.iat,
      exp: decoded.exp
    })
    
    return decoded
  } catch (error) {
    console.error('❌ [AUTH] Erro ao verificar token:', error.message)
    console.error('❌ [AUTH] Tipo de erro:', error.name)
    throw new Error('Token inválido ou expirado')
  }
}

// Função para login usando Supabase
async function handleLogin(req, res) {
  try {
    console.log('🔐 [AUTH] Iniciando processo de login...')
    
    const { email, password } = req.body
    console.log('📧 [AUTH] Email recebido:', email ? 'Sim' : 'Não')

    if (!email || !password) {
      console.log('❌ [AUTH] Email ou senha ausentes')
      return res.status(400).json({
        success: false,
        error: 'Email e senha são obrigatórios'
      })
    }

    // Verificar se o Supabase está configurado
    if (!supabase) {
      console.error('❌ [AUTH] Supabase não disponível')
      return res.status(500).json({
        success: false,
        error: 'Configuração do Supabase não encontrada'
      })
    }

    console.log('🔐 [AUTH] Tentando autenticar com Supabase...')

    // Autenticar com Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      console.error('❌ [AUTH] Erro de autenticação Supabase:', error.message)
      return res.status(401).json({
        success: false,
        error: 'Credenciais inválidas'
      })
    }

    if (!data || !data.user) {
      console.error('❌ [AUTH] Usuário não encontrado na resposta')
      return res.status(401).json({
        success: false,
        error: 'Credenciais inválidas'
      })
    }

    console.log('✅ [AUTH] Usuário autenticado:', data.user.email)

    // Verificar se o usuário tem permissão de acesso
    if (!AUTHORIZED_USERS.includes(data.user.email)) {
      console.error('❌ [AUTH] Usuário não autorizado:', data.user.email)
      return res.status(403).json({
        success: false,
        error: 'Acesso negado. Usuário não autorizado.'
      })
    }

    console.log('✅ [AUTH] Usuário autorizado, gerando token...')

    // Gerar token JWT personalizado
    const customToken = generateCustomToken(data.user)
    
    // Calcular data de expiração (5 horas)
    const expiresAt = new Date(Date.now() + (5 * 60 * 60 * 1000))

    console.log('✅ [AUTH] Login bem-sucedido para:', data.user.email)
    
    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || data.user.email,
          role: data.user.email === 'adminfhd@fhd.com' ? 'admin' : 'user'
        },
        token: customToken,
        expiresAt: expiresAt.toISOString()
      }
    })
  } catch (error) {
    console.error('❌ [AUTH] Erro no login:', error)
    console.error('❌ [AUTH] Stack trace:', error.stack)
    return res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    })
  }
}

// Função para logout
async function handleLogout(req, res) {
  try {
    console.log('✅ [AUTH] Logout solicitado')
    
    if (supabase) {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('❌ [AUTH] Erro no logout Supabase:', error)
      }
    }
    
    return res.status(200).json({
      success: true,
      message: 'Logout realizado com sucesso'
    })
  } catch (error) {
    console.error('❌ [AUTH] Erro no logout:', error)
    return res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    })
  }
}

// Função para verificar token
async function handleVerifyToken(req, res) {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Token não fornecido'
      })
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)
    
    console.log('✅ [AUTH] Token verificado para:', decoded.email)
    
    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: decoded.id,
          email: decoded.email,
          name: decoded.name,
          role: decoded.role
        },
        valid: true
      }
    })
  } catch (error) {
    console.error('❌ [AUTH] Erro na verificação do token:', error)
    return res.status(401).json({
      success: false,
      error: 'Token inválido ou expirado'
    })
  }
}

// Função para renovar token
async function handleRefreshToken(req, res) {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Token não fornecido'
      })
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)
    
    if (!supabase) {
      return res.status(500).json({
        success: false,
        error: 'Supabase não disponível'
      })
    }

    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user || user.email !== decoded.email) {
      return res.status(401).json({
        success: false,
        error: 'Usuário não encontrado'
      })
    }

    const newToken = generateCustomToken(user)
    const expiresAt = new Date(Date.now() + (5 * 60 * 60 * 1000))

    console.log('✅ [AUTH] Token renovado para:', user.email)
    
    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || user.email,
          role: user.email === 'adminfhd@fhd.com' ? 'admin' : 'user'
        },
        token: newToken,
        expiresAt: expiresAt.toISOString()
      }
    })
  } catch (error) {
    console.error('❌ [AUTH] Erro na renovação do token:', error)
    return res.status(401).json({
      success: false,
      error: 'Token inválido ou expirado'
    })
  }
}

// Handler principal
export default async function handler(req, res) {
  console.log('🚀 [AUTH] Requisição recebida:', req.method, req.url)
  console.log('🌐 [AUTH] Origin:', req.headers.origin)
  console.log('📋 [AUTH] Headers:', req.headers)
  console.log('📝 [AUTH] Body:', req.body)
  console.log('🔍 [AUTH] Query:', req.query)
  
  // Configurar CORS mais seguro
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://fhd-automacao-industrial-bq67.vercel.app',
    'https://fhdautomacaoindustrialapp.vercel.app',
    'https://www.fhdautomacaoindustrial.com.br',
    process.env.NEXT_PUBLIC_APP_URL
  ].filter(Boolean)

  const origin = req.headers.origin
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Credentials', 'true')

  // Responder a requisições OPTIONS
  if (req.method === 'OPTIONS') {
    console.log('✅ [AUTH] Respondendo a OPTIONS')
    return res.status(200).end()
  }

  try {
    const { method } = req
    const { action } = req.query

    console.log('🔍 [AUTH] Método:', method, 'Ação:', action)

    switch (method) {
      case 'POST':
        switch (action) {
          case 'login':
            return await handleLogin(req, res)
          case 'logout':
            return await handleLogout(req, res)
          case 'verify':
            return await handleVerifyToken(req, res)
          case 'refresh':
            return await handleRefreshToken(req, res)
          default:
            console.log('❌ [AUTH] Ação não especificada:', action)
            return res.status(400).json({
              success: false,
              error: 'Ação não especificada'
            })
        }
      default:
        console.log('❌ [AUTH] Método não permitido:', method)
        return res.status(405).json({
          success: false,
          error: 'Método não permitido'
        })
    }
  } catch (error) {
    console.error('❌ [AUTH] Erro geral:', error)
    console.error('❌ [AUTH] Stack trace:', error.stack)
    return res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    })
  }
}
