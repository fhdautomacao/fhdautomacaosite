import express from 'express'
import cors from 'cors'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Configuração CORS mais segura
const corsOptions = {
  origin: function (origin, callback) {
    // Lista de origens permitidas
    const allowedOrigins = [
      'http://localhost:5173', // Frontend local
      'http://localhost:3000', // Frontend alternativo
      'https://fhd-automacao-industrial-bq67.vercel.app', // Produção antiga
      'https://fhd-automacao-industrial-bq67.vercel.app/admin', // Admin produção antiga
      'https://fhd-automacao-industrial-bq67.vercel.app/admin/*', // Admin subpáginas antiga
      'https://fhdautomacaoindustrialapp.vercel.app', // Nova produção
      'https://fhdautomacaoindustrialapp.vercel.app/admin', // Nova admin produção
      'https://fhdautomacaoindustrialapp.vercel.app/admin/*', // Nova admin subpáginas
      process.env.NEXT_PUBLIC_APP_URL, // URL da app configurada no env
      process.env.NEXT_PUBLIC_APP_URL + '/admin', // Admin da app
      process.env.NEXT_PUBLIC_APP_URL + '/admin/*', // Admin subpáginas da app
      // Adicionar origens do arquivo de ambiente
      ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [])
    ].filter(Boolean) // Remove valores undefined/null

    // Permitir requisições sem origin (como mobile apps ou Postman)
    if (!origin) {
      return callback(null, true)
    }

    // Verificar se a origem está na lista de permitidas
    if (allowedOrigins.includes(origin) || allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      callback(null, true)
    } else {
      console.warn(`🚫 CORS bloqueado para origem: ${origin}`)
      callback(new Error('Não permitido pelo CORS'))
    }
  },
  credentials: true, // Permitir cookies e headers de autenticação
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-API-Key'
  ],
  optionsSuccessStatus: 200 // Para compatibilidade com navegadores antigos
}

// Middleware CORS
app.use(cors(corsOptions))

// Middleware para log de requisições
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.path} - Origin: ${req.get('Origin') || 'Sem origin'}`)
  next()
})

app.use(express.json())

// Middleware de autenticação para rotas administrativas
const requireAdminAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key']
  const authHeader = req.headers.authorization
  
  // Verificar se é uma requisição da página admin
  const referer = req.get('Referer') || ''
  const isAdminRequest = referer.includes('/admin') || 
                        req.path.includes('/admin') ||
                        req.headers['x-admin-request'] === 'true'

  // Se não for requisição admin, permitir (para frontend público)
  if (!isAdminRequest) {
    return next()
  }

  // Para requisições admin, verificar autenticação
  if (!apiKey && !authHeader) {
    console.warn('🚫 Tentativa de acesso admin sem autenticação')
    return res.status(401).json({ 
      error: 'Acesso não autorizado',
      message: 'Autenticação necessária para operações administrativas'
    })
  }

  // Validar API key se fornecido
  if (apiKey && apiKey !== process.env.ADMIN_API_KEY) {
    console.warn('🚫 API Key inválida')
    return res.status(401).json({ 
      error: 'API Key inválida',
      message: 'Chave de API fornecida é inválida'
    })
  }

  // Validar token Bearer se fornecido
  if (authHeader && !authHeader.startsWith('Bearer ')) {
    console.warn('🚫 Formato de autorização inválido')
    return res.status(401).json({ 
      error: 'Formato de autorização inválido',
      message: 'Token deve estar no formato Bearer'
    })
  }

  console.log('✅ Acesso admin autorizado')
  next()
}

// Aplicar middleware de autenticação em todas as rotas
app.use(requireAdminAuth)

// Configurar Supabase (usar as variáveis já existentes no projeto)
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente do Supabase não configuradas!')
  console.error('Configure VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no arquivo .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Rota para SEO Settings
app.get('/seo-settings', async (req, res) => {
  try {
    const { page_name, id } = req.query

    let query = supabase
      .from('seo_settings')
      .select('*')
      .eq('is_active', true)

    if (page_name) {
      query = query.eq('page_name', page_name)
    }

    if (id) {
      query = query.eq('id', id)
    }

    const { data, error } = await query.order('page_name')

    if (error) {
      console.error('Erro ao buscar SEO settings:', error)
      return res.status(500).json({ 
        error: 'Erro ao buscar configurações de SEO',
        details: error.message 
      })
    }

    return res.status(200).json({
      success: true,
      data: page_name ? data[0] : data,
      count: data.length
    })
  } catch (error) {
    console.error('Erro no GET SEO settings:', error)
    return res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: error.message 
    })
  }
})

// Rota POST para criar configurações
app.post('/seo-settings', async (req, res) => {
  try {
    const seoData = req.body

    if (!seoData.page_name) {
      return res.status(400).json({ 
        error: 'Nome da página é obrigatório' 
      })
    }

    const { data, error } = await supabase
      .from('seo_settings')
      .upsert([seoData])
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar/atualizar SEO settings:', error)
      return res.status(500).json({ 
        error: 'Erro ao salvar configurações de SEO',
        details: error.message 
      })
    }

    return res.status(200).json({
      success: true,
      data
    })
  } catch (error) {
    console.error('Erro no POST SEO settings:', error)
    return res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: error.message 
    })
  }
})

// Rota PUT para atualizar configurações
app.put('/seo-settings/:id', async (req, res) => {
  try {
    const { id } = req.params
    const seoData = req.body

    const { data, error } = await supabase
      .from('seo_settings')
      .update(seoData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar SEO settings:', error)
      return res.status(500).json({ 
        error: 'Erro ao atualizar configurações de SEO',
        details: error.message 
      })
    }

    return res.status(200).json({
      success: true,
      data
    })
  } catch (error) {
    console.error('Erro no PUT SEO settings:', error)
    return res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: error.message 
    })
  }
})

// Rota DELETE para remover configurações
app.delete('/seo-settings/:id', async (req, res) => {
  try {
    const { id } = req.params

    const { error } = await supabase
      .from('seo_settings')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erro ao deletar SEO settings:', error)
      return res.status(500).json({ 
        error: 'Erro ao deletar configurações de SEO',
        details: error.message 
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Configuração deletada com sucesso'
    })
  } catch (error) {
    console.error('Erro no DELETE SEO settings:', error)
    return res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: error.message 
    })
  }
})

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'API de SEO funcionando corretamente'
  })
})

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor API rodando na porta ${PORT}`)
  console.log(`📡 Health check: http://localhost:${PORT}/health`)
  console.log(`🔗 API SEO: http://localhost:${PORT}/seo-settings`)
})

export default app
