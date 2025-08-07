import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  console.log('API Quotations chamada:', {
    method: req.method,
    headers: req.headers,
    query: req.query
  })

  try {
    // Criar cliente Supabase
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error('Variáveis do Supabase não encontradas')
      return res.status(500).json({ error: 'Configuração do Supabase não encontrada' })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Verificar autenticação
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token de autenticação necessário' })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return res.status(401).json({ error: 'Token inválido' })
    }

    console.log('Usuário autenticado:', { userId: user.id, email: user.email })

    switch (req.method) {
      case 'GET':
        return await handleGetQuotations(req, res, supabase)
      case 'POST':
        return await handleCreateQuotation(req, res, supabase, user)
      default:
        return res.status(405).json({ error: 'Method not allowed' })
    }

  } catch (error) {
    console.error('Erro na API de quotations:', error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

async function handleGetQuotations(req, res, supabase) {
  try {
    const { status, page = 1, limit = 50 } = req.query
    
    let query = supabase
      .from('quotations')
      .select('*')
      .order('created_at', { ascending: false })

    // Aplicar filtros
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    // Paginação
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)

    const { data: quotations, error } = await query

    if (error) {
      console.error('Erro ao buscar quotations:', error)
      return res.status(500).json({ error: 'Erro ao buscar quotations' })
    }

    console.log('Quotations encontrados:', quotations.length)
    return res.status(200).json({
      data: quotations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: quotations.length
      }
    })

  } catch (error) {
    console.error('Erro em handleGetQuotations:', error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

async function handleCreateQuotation(req, res, supabase, user) {
  try {
    const quotationData = req.body

    // Validar dados obrigatórios
    if (!quotationData.client_name || !quotationData.service_type || !quotationData.amount) {
      return res.status(400).json({ 
        error: 'Dados obrigatórios: client_name, service_type, amount' 
      })
    }

    // Adicionar dados do usuário
    const newQuotation = {
      ...quotationData,
      user_id: user.id,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { data: quotation, error } = await supabase
      .from('quotations')
      .insert(newQuotation)
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar quotation:', error)
      return res.status(500).json({ error: 'Erro ao criar quotation' })
    }

    console.log('Quotation criado:', { quotationId: quotation.id, clientName: quotation.client_name })
    return res.status(201).json(quotation)

  } catch (error) {
    console.error('Erro em handleCreateQuotation:', error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}
