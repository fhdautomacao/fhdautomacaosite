import express from 'express'
import cors from 'cors'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

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
