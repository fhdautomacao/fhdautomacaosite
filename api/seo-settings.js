import { createClient } from '@supabase/supabase-js'

// Configurar Supabase com as variáveis existentes
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente do Supabase não configuradas!')
  console.error('VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL ? '✅ Configurada' : '❌ Não configurada')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configurada' : '❌ Não configurada')
  console.error('SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Configurada' : '❌ Não configurada')
  console.error('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Configurada' : '❌ Não configurada')
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Função para buscar configurações
async function handleGet(req, res) {
  try {
    const { page_name } = req.query
    console.log('🔍 [API] Buscando configuração para page_name:', page_name)

    if (page_name) {
      // Buscar configuração específica por página
      console.log('🔍 [API] Buscando configuração específica...')
      const { data, error } = await supabase
        .from('seo_settings')
        .select('*')
        .eq('page_name', page_name)
        .eq('is_active', true)
        .single()

      if (error) {
        console.error('❌ [API] Erro ao buscar configuração:', error)
        console.error('🔍 [API] Detalhes do erro:', error.message)
        return res.status(500).json({ 
          success: false, 
          error: 'Erro ao buscar configuração de SEO',
          details: error.message
        })
      }

      if (!data) {
        console.warn('⚠️ [API] Configuração não encontrada para:', page_name)
        return res.status(404).json({ 
          success: false, 
          error: 'Configuração não encontrada' 
        })
      }

      console.log('✅ [API] Configuração encontrada para:', page_name)
      console.log('🔍 [API] Dados retornados:', JSON.stringify(data, null, 2))
      return res.status(200).json({ 
        success: true, 
        data 
      })
    } else {
      // Buscar todas as configurações
      console.log('🔍 [API] Buscando todas as configurações...')
      const { data, error } = await supabase
        .from('seo_settings')
        .select('*')
        .order('page_name')

      if (error) {
        console.error('❌ [API] Erro ao buscar configurações:', error)
        console.error('🔍 [API] Detalhes do erro:', error.message)
        return res.status(500).json({ 
          success: false, 
          error: 'Erro ao buscar configurações de SEO',
          details: error.message
        })
      }

      console.log('✅ [API] Configurações carregadas:', data?.length || 0)
      return res.status(200).json({ 
        success: true, 
        data: data || [] 
      })
    }
  } catch (error) {
    console.error('❌ [API] Erro interno:', error)
    console.error('🔍 [API] Stack trace:', error.stack)
    return res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor',
      details: error.message
    })
  }
}

// Função para criar configuração
async function handlePost(req, res) {
  try {
    const { body } = req

    if (!body.page_name) {
      return res.status(400).json({ 
        success: false, 
        error: 'Nome da página é obrigatório' 
      })
    }

    const { data, error } = await supabase
      .from('seo_settings')
      .insert([body])
      .select()
      .single()

    if (error) {
      console.error('❌ Erro ao criar configuração:', error)
      return res.status(500).json({ 
        success: false, 
        error: 'Erro ao criar configuração de SEO' 
      })
    }

    console.log('✅ Configuração criada:', data.page_name)
    return res.status(201).json({ 
      success: true, 
      data 
    })
  } catch (error) {
    console.error('❌ Erro interno:', error)
    return res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    })
  }
}

// Função para atualizar configuração
async function handlePut(req, res) {
  try {
    const { id } = req.query
    const { body } = req

    if (!id) {
      return res.status(400).json({ 
        success: false, 
        error: 'ID é obrigatório' 
      })
    }

    const { data, error } = await supabase
      .from('seo_settings')
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('❌ Erro ao atualizar configuração:', error)
      return res.status(500).json({ 
        success: false, 
        error: 'Erro ao atualizar configuração de SEO' 
      })
    }

    console.log('✅ Configuração atualizada:', data.page_name)
    return res.status(200).json({ 
      success: true, 
      data 
    })
  } catch (error) {
    console.error('❌ Erro interno:', error)
    return res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    })
  }
}

// Função para deletar configuração
async function handleDelete(req, res) {
  try {
    const { id } = req.query

    if (!id) {
      return res.status(400).json({ 
        success: false, 
        error: 'ID é obrigatório' 
      })
    }

    const { error } = await supabase
      .from('seo_settings')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('❌ Erro ao deletar configuração:', error)
      return res.status(500).json({ 
        success: false, 
        error: 'Erro ao deletar configuração de SEO' 
      })
    }

    console.log('✅ Configuração deletada:', id)
    return res.status(200).json({ 
      success: true, 
      message: 'Configuração deletada com sucesso' 
    })
  } catch (error) {
    console.error('❌ Erro interno:', error)
    return res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    })
  }
}

// Configuração CORS segura
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://fhd-automacao-industrial-bq67.vercel.app', // Produção antiga
      'https://fhd-automacao-industrial-bq67.vercel.app/admin', // Admin produção antiga
      'https://fhd-automacao-industrial-bq67.vercel.app/admin/*', // Admin subpáginas antiga
      'https://fhdautomacaoindustrialapp.vercel.app', // Nova produção
      'https://fhdautomacaoindustrialapp.vercel.app/admin', // Nova admin produção
      'https://fhdautomacaoindustrialapp.vercel.app/admin/*', // Nova admin subpáginas
      process.env.NEXT_PUBLIC_APP_URL,
      process.env.NEXT_PUBLIC_APP_URL + '/admin',
      process.env.NEXT_PUBLIC_APP_URL + '/admin/*',
      ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [])
    ].filter(Boolean)

    if (!origin) { 
      console.log('⚠️ [API] Requisição sem origin (server-to-server)')
      return callback(null, true) 
    }
    
    if (allowedOrigins.includes(origin) || allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      console.log('✅ [API] Origin permitida:', origin)
      callback(null, true)
    } else {
      console.warn('🚫 [API] CORS bloqueado para origem:', origin)
      callback(new Error('Não permitido pelo CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'X-API-Key', 'X-Admin-Request'],
  optionsSuccessStatus: 200
}

// Middleware de autenticação admin
const requireAdminAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key']
  const authHeader = req.headers.authorization
  const referer = req.get('Referer') || ''
  const isAdminRequest = referer.includes('/admin') || req.path.includes('/admin') || req.headers['x-admin-request'] === 'true'
  
  if (!isAdminRequest) { 
    console.log('✅ [API] Requisição pública - sem autenticação necessária')
    return next() 
  }
  
  if (!apiKey && !authHeader) { 
    console.warn('🚫 [API] Tentativa de acesso admin sem autenticação')
    return res.status(401).json({ 
      error: 'Acesso não autorizado', 
      message: 'Autenticação necessária para operações administrativas' 
    }) 
  }
  
  if (apiKey && apiKey !== process.env.ADMIN_API_KEY) { 
    console.warn('🚫 [API] API Key inválida')
    return res.status(401).json({ 
      error: 'API Key inválida', 
      message: 'Chave de API fornecida é inválida' 
    }) 
  }
  
  if (authHeader && !authHeader.startsWith('Bearer ')) { 
    console.warn('🚫 [API] Formato de autorização inválido')
    return res.status(401).json({ 
      error: 'Formato de autorização inválido', 
      message: 'Token deve estar no formato Bearer' 
    }) 
  }
  
  console.log('✅ [API] Acesso admin autorizado')
  next()
}

// Handler principal
export default async function handler(req, res) {
  console.log('🚀 [API] Requisição recebida:', req.method, req.url)
  console.log('🔍 [API] Query params:', req.query)
  console.log('🔍 [API] Headers:', req.headers)
  console.log('🌐 [API] Origin:', req.headers.origin)
  
  // Aplicar CORS
  const origin = req.headers.origin
  if (origin) {
    const isAllowed = corsOptions.origin(origin, (error, allowed) => {
      if (error || !allowed) {
        console.warn('🚫 [API] CORS bloqueado:', origin)
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
  
  // Configurar headers CORS para origem permitida
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
  res.setHeader('Access-Control-Allow-Methods', corsOptions.methods.join(', '))
  res.setHeader('Access-Control-Allow-Headers', corsOptions.allowedHeaders.join(', '))
  res.setHeader('Access-Control-Allow-Credentials', 'true')

  // Responder a requisições OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    console.log('✅ [API] Respondendo a OPTIONS')
    return res.status(200).end()
  }

  // Aplicar autenticação admin para operações de escrita
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
    const apiKey = req.headers['x-api-key']
    const authHeader = req.headers.authorization
    const referer = req.headers.referer || ''
    const isAdminRequest = referer.includes('/admin') || req.headers['x-admin-request'] === 'true'
    
    if (isAdminRequest) {
      if (!apiKey && !authHeader) { 
        console.warn('🚫 [API] Tentativa de acesso admin sem autenticação')
        return res.status(401).json({ 
          error: 'Acesso não autorizado', 
          message: 'Autenticação necessária para operações administrativas' 
        }) 
      }
      
      if (apiKey && apiKey !== process.env.ADMIN_API_KEY) { 
        console.warn('🚫 [API] API Key inválida')
        return res.status(401).json({ 
          error: 'API Key inválida', 
          message: 'Chave de API fornecida é inválida' 
        }) 
      }
      
      if (authHeader && !authHeader.startsWith('Bearer ')) { 
        console.warn('🚫 [API] Formato de autorização inválido')
        return res.status(401).json({ 
          error: 'Formato de autorização inválido', 
          message: 'Token deve estar no formato Bearer' 
        }) 
      }
      
      console.log('✅ [API] Acesso admin autorizado')
    }
  }

  try {
    const { method } = req
    console.log('🔍 [API] Método:', method)

    switch (method) {
      case 'GET':
        console.log('📥 [API] Executando GET')
        return await handleGet(req, res)
      case 'POST':
        console.log('📥 [API] Executando POST')
        return await handlePost(req, res)
      case 'PUT':
        console.log('📥 [API] Executando PUT')
        return await handlePut(req, res)
      case 'DELETE':
        console.log('📥 [API] Executando DELETE')
        return await handleDelete(req, res)
      default:
        console.error('❌ [API] Método não permitido:', method)
        return res.status(405).json({ 
          success: false, 
          error: 'Método não permitido' 
        })
    }
  } catch (error) {
    console.error('❌ [API] Erro geral:', error)
    console.error('🔍 [API] Stack trace:', error.stack)
    return res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor',
      details: error.message
    })
  }
}
