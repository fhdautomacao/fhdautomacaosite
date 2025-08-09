import { createClient } from '@supabase/supabase-js'

// Usar variáveis já existentes: VITE_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_URL
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    const { method, body, query } = req

    switch (method) {
      case 'GET':
        return await handleGet(req, res)
      case 'POST':
        return await handlePost(req, res)
      case 'PUT':
        return await handlePut(req, res)
      case 'DELETE':
        return await handleDelete(req, res)
      default:
        return res.status(405).json({ error: 'Método não permitido' })
    }
  } catch (error) {
    console.error('Erro na API de SEO Settings:', error)
    return res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: error.message 
    })
  }
}

// GET - Buscar configurações de SEO
async function handleGet(req, res) {
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
}

// POST - Criar nova configuração de SEO
async function handlePost(req, res) {
  try {
    const seoData = req.body

    // Validações básicas
    if (!seoData.page_name) {
      return res.status(400).json({ 
        error: 'Nome da página é obrigatório' 
      })
    }

    // Verificar se já existe uma configuração para esta página
    const { data: existing } = await supabase
      .from('seo_settings')
      .select('id')
      .eq('page_name', seoData.page_name)
      .single()

    if (existing) {
      return res.status(409).json({ 
        error: 'Já existe uma configuração para esta página' 
      })
    }

    // Preparar dados com valores padrão
    const seoSettings = {
      page_name: seoData.page_name,
      title: seoData.title || '',
      description: seoData.description || '',
      keywords: seoData.keywords || '',
      canonical_url: seoData.canonical_url || '',
      og_title: seoData.og_title || seoData.title || '',
      og_description: seoData.og_description || seoData.description || '',
      og_image: seoData.og_image || '',
      og_type: seoData.og_type || 'website',
      og_site_name: seoData.og_site_name || 'FHD Automação Industrial',
      og_locale: seoData.og_locale || 'pt_BR',
      twitter_card: seoData.twitter_card || 'summary_large_image',
      twitter_title: seoData.twitter_title || seoData.title || '',
      twitter_description: seoData.twitter_description || seoData.description || '',
      twitter_image: seoData.twitter_image || seoData.og_image || '',
      structured_data: seoData.structured_data || null,
      robots: seoData.robots || 'index, follow',
      author: seoData.author || 'FHD Automação Industrial',
      viewport: seoData.viewport || 'width=device-width, initial-scale=1.0',
      charset: seoData.charset || 'UTF-8',
      favicon_url: seoData.favicon_url || '',
      is_active: seoData.is_active !== undefined ? seoData.is_active : true
    }

    const { data, error } = await supabase
      .from('seo_settings')
      .insert([seoSettings])
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar SEO settings:', error)
      return res.status(500).json({ 
        error: 'Erro ao criar configuração de SEO',
        details: error.message 
      })
    }

    return res.status(201).json({
      success: true,
      data,
      message: 'Configuração de SEO criada com sucesso'
    })
  } catch (error) {
    console.error('Erro no POST SEO settings:', error)
    return res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: error.message 
    })
  }
}

// PUT - Atualizar configuração de SEO
async function handlePut(req, res) {
  try {
    const { id } = req.query
    const updateData = req.body

    if (!id) {
      return res.status(400).json({ 
        error: 'ID é obrigatório para atualização' 
      })
    }

    // Verificar se a configuração existe
    const { data: existing } = await supabase
      .from('seo_settings')
      .select('id')
      .eq('id', id)
      .single()

    if (!existing) {
      return res.status(404).json({ 
        error: 'Configuração de SEO não encontrada' 
      })
    }

    // Preparar dados para atualização
    const updateFields = {}
    
    if (updateData.page_name !== undefined) updateFields.page_name = updateData.page_name
    if (updateData.title !== undefined) updateFields.title = updateData.title
    if (updateData.description !== undefined) updateFields.description = updateData.description
    if (updateData.keywords !== undefined) updateFields.keywords = updateData.keywords
    if (updateData.canonical_url !== undefined) updateFields.canonical_url = updateData.canonical_url
    if (updateData.og_title !== undefined) updateFields.og_title = updateData.og_title
    if (updateData.og_description !== undefined) updateFields.og_description = updateData.og_description
    if (updateData.og_image !== undefined) updateFields.og_image = updateData.og_image
    if (updateData.og_type !== undefined) updateFields.og_type = updateData.og_type
    if (updateData.og_site_name !== undefined) updateFields.og_site_name = updateData.og_site_name
    if (updateData.og_locale !== undefined) updateFields.og_locale = updateData.og_locale
    if (updateData.twitter_card !== undefined) updateFields.twitter_card = updateData.twitter_card
    if (updateData.twitter_title !== undefined) updateFields.twitter_title = updateData.twitter_title
    if (updateData.twitter_description !== undefined) updateFields.twitter_description = updateData.twitter_description
    if (updateData.twitter_image !== undefined) updateFields.twitter_image = updateData.twitter_image
    if (updateData.structured_data !== undefined) updateFields.structured_data = updateData.structured_data
    if (updateData.robots !== undefined) updateFields.robots = updateData.robots
    if (updateData.author !== undefined) updateFields.author = updateData.author
    if (updateData.viewport !== undefined) updateFields.viewport = updateData.viewport
    if (updateData.charset !== undefined) updateFields.charset = updateData.charset
    if (updateData.favicon_url !== undefined) updateFields.favicon_url = updateData.favicon_url
    if (updateData.is_active !== undefined) updateFields.is_active = updateData.is_active

    const { data, error } = await supabase
      .from('seo_settings')
      .update(updateFields)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar SEO settings:', error)
      return res.status(500).json({ 
        error: 'Erro ao atualizar configuração de SEO',
        details: error.message 
      })
    }

    return res.status(200).json({
      success: true,
      data,
      message: 'Configuração de SEO atualizada com sucesso'
    })
  } catch (error) {
    console.error('Erro no PUT SEO settings:', error)
    return res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: error.message 
    })
  }
}

// DELETE - Deletar configuração de SEO
async function handleDelete(req, res) {
  try {
    const { id } = req.query

    if (!id) {
      return res.status(400).json({ 
        error: 'ID é obrigatório para exclusão' 
      })
    }

    // Verificar se a configuração existe
    const { data: existing } = await supabase
      .from('seo_settings')
      .select('id')
      .eq('id', id)
      .single()

    if (!existing) {
      return res.status(404).json({ 
        error: 'Configuração de SEO não encontrada' 
      })
    }

    const { error } = await supabase
      .from('seo_settings')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erro ao deletar SEO settings:', error)
      return res.status(500).json({ 
        error: 'Erro ao deletar configuração de SEO',
        details: error.message 
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Configuração de SEO deletada com sucesso'
    })
  } catch (error) {
    console.error('Erro no DELETE SEO settings:', error)
    return res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: error.message 
    })
  }
}
