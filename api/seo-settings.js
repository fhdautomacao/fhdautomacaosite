import { createClient } from '@supabase/supabase-js'

// Configurar Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente do Supabase não configuradas!')
  console.error('VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL ? '✅ Configurada' : '❌ Não configurada')
  console.error('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Configurada' : '❌ Não configurada')
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Função para buscar configurações
async function handleGet(req, res) {
  try {
    const { page_name } = req.query

    if (page_name) {
      // Buscar configuração específica por página
      const { data, error } = await supabase
        .from('seo_settings')
        .select('*')
        .eq('page_name', page_name)
        .eq('is_active', true)
        .single()

      if (error) {
        console.error('❌ Erro ao buscar configuração:', error)
        return res.status(500).json({ 
          success: false, 
          error: 'Erro ao buscar configuração de SEO' 
        })
      }

      if (!data) {
        return res.status(404).json({ 
          success: false, 
          error: 'Configuração não encontrada' 
        })
      }

      console.log('✅ Configuração encontrada para:', page_name)
      return res.status(200).json({ 
        success: true, 
        data 
      })
    } else {
      // Buscar todas as configurações
      const { data, error } = await supabase
        .from('seo_settings')
        .select('*')
        .order('page_name')

      if (error) {
        console.error('❌ Erro ao buscar configurações:', error)
        return res.status(500).json({ 
          success: false, 
          error: 'Erro ao buscar configurações de SEO' 
        })
      }

      console.log('✅ Configurações carregadas:', data?.length || 0)
      return res.status(200).json({ 
        success: true, 
        data: data || [] 
      })
    }
  } catch (error) {
    console.error('❌ Erro interno:', error)
    return res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor' 
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

// Handler principal
export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Responder a requisições OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    const { method } = req

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
        return res.status(405).json({ 
          success: false, 
          error: 'Método não permitido' 
        })
    }
  } catch (error) {
    console.error('❌ Erro geral:', error)
    return res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    })
  }
}
