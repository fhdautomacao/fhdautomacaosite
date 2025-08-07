import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  console.log('API Clients chamada:', {
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
        return await handleGetClients(req, res, supabase)
      case 'POST':
        return await handleCreateClient(req, res, supabase, user)
      default:
        return res.status(405).json({ error: 'Method not allowed' })
    }

  } catch (error) {
    console.error('Erro na API de clients:', error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

async function handleGetClients(req, res, supabase) {
  try {
    const { page = 1, limit = 50 } = req.query
    
    let query = supabase
      .from('clients')
      .select('*')
      .order('display_order', { ascending: true })

    // Paginação
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)

    const { data: clients, error } = await query

    if (error) {
      console.error('Erro ao buscar clients:', error)
      return res.status(500).json({ error: 'Erro ao buscar clients' })
    }

    console.log('Clients encontrados:', clients.length)
    return res.status(200).json({
      data: clients,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: clients.length
      }
    })

  } catch (error) {
    console.error('Erro em handleGetClients:', error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

async function handleCreateClient(req, res, supabase, user) {
  try {
    const clientData = req.body

    // Validar dados obrigatórios
    if (!clientData.name || !clientData.email) {
      return res.status(400).json({ 
        error: 'Dados obrigatórios: name, email' 
      })
    }

    // Adicionar dados do usuário
    const newClient = {
      ...clientData,
      user_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { data: client, error } = await supabase
      .from('clients')
      .insert(newClient)
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar client:', error)
      return res.status(500).json({ error: 'Erro ao criar client' })
    }

    console.log('Client criado:', { clientId: client.id, name: client.name })
    return res.status(201).json(client)

  } catch (error) {
    console.error('Erro em handleCreateClient:', error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}
