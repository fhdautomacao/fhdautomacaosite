import jwt from 'jsonwebtoken'
import { createClient } from '@supabase/supabase-js'

// Configuração JWT
const JWT_SECRET = process.env.JWT_SECRET || 'U3pZjijm9HvwB4T0uGvgXlazWT63+f2U701YmPc6i7umkChmBalYatFX+s1j/ERIbXcSWNjOqcZB5WdDWZqJzw=='
const JWT_EXPIRES_IN = '24h' // Token expira em 24 horas

// Configuração Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

// Criar cliente Supabase
const supabase = createClient(supabaseUrl, supabaseKey)

// Lista de usuários autorizados
const AUTHORIZED_USERS = [
  'adminfhd@fhd.com',
  'fhduser@fhd.com'
]

// Configuração CORS segura
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://fhd-automacao-industrial-bq67.vercel.app',
      'https://fhd-automacao-industrial-bq67.vercel.app/admin',
      'https://fhdautomacaoindustrialapp.vercel.app',
      'https://fhdautomacaoindustrialapp.vercel.app/admin',
      process.env.NEXT_PUBLIC_APP_URL,
      process.env.NEXT_PUBLIC_APP_URL + '/admin',
      ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [])
    ].filter(Boolean)

    if (!origin) { 
      return callback(null, true) 
    }
    
    if (allowedOrigins.includes(origin) || allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      callback(null, true)
    } else {
      callback(new Error('Não permitido pelo CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  optionsSuccessStatus: 200
}

// Função para gerar token JWT personalizado
const generateCustomToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.user_metadata?.name || user.email,
    role: user.email === 'adminfhd@fhd.com' ? 'admin' : 'user',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 horas
  }
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

// Função para verificar token JWT
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    throw new Error('Token inválido ou expirado')
  }
}

// Função para login usando Supabase
async function handleLogin(req, res) {
  try {
    const { email, password } = req.body

    console.log('🔐 [AUTH] Tentativa de login para:', email)

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email e senha são obrigatórios'
      })
    }

    // Verificar se o Supabase está configurado
    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ [AUTH] Supabase não configurado')
      return res.status(500).json({
        success: false,
        error: 'Configuração do Supabase não encontrada'
      })
    }

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

    if (!data.user) {
      console.error('❌ [AUTH] Usuário não encontrado')
      return res.status(401).json({
        success: false,
        error: 'Credenciais inválidas'
      })
    }

    // Verificar se o usuário tem permissão de acesso
    if (!AUTHORIZED_USERS.includes(data.user.email)) {
      console.error('❌ [AUTH] Usuário não autorizado:', data.user.email)
      return res.status(403).json({
        success: false,
        error: 'Acesso negado. Usuário não autorizado.'
      })
    }

    // Gerar token JWT personalizado
    const customToken = generateCustomToken(data.user)
    
    // Calcular data de expiração
    const expiresAt = new Date(Date.now() + (24 * 60 * 60 * 1000)) // 24 horas

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
    
    // Fazer logout do Supabase
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('❌ [AUTH] Erro no logout Supabase:', error)
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

    const token = authHeader.substring(7) // Remove 'Bearer '
    
    // Verificar token
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
    
    // Verificar token atual
    const decoded = verifyToken(token)
    
    // Verificar se o usuário ainda existe no Supabase
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user || user.email !== decoded.email) {
      return res.status(401).json({
        success: false,
        error: 'Usuário não encontrado'
      })
    }

    // Gerar novo token
    const newToken = generateCustomToken(user)
    const expiresAt = new Date(Date.now() + (24 * 60 * 60 * 1000))

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
  
  // Aplicar CORS
  const origin = req.headers.origin
  if (origin) {
    const isAllowed = corsOptions.origin(origin, (error, allowed) => {
      if (error || !allowed) {
        console.warn('🚫 [AUTH] CORS bloqueado:', origin)
        return res.status(403).json({ 
          error: 'CORS não permitido', 
          message: 'Origem não autorizada' 
        })
      }
    })
    
    if (isAllowed === false) {
      return res.status(403).json({ 
        error: 'CORS não permitido', 
        message: 'Origem não autorizada' 
      })
    }
  }
  
  // Configurar headers CORS
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
  res.setHeader('Access-Control-Allow-Methods', corsOptions.methods.join(', '))
  res.setHeader('Access-Control-Allow-Headers', corsOptions.allowedHeaders.join(', '))
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
            return res.status(400).json({
              success: false,
              error: 'Ação não especificada'
            })
        }
      default:
        return res.status(405).json({
          success: false,
          error: 'Método não permitido'
        })
    }
  } catch (error) {
    console.error('❌ [AUTH] Erro geral:', error)
    return res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    })
  }
}
