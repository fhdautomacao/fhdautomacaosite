import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  console.log('API Login chamada:', {
    method: req.method,
    headers: req.headers,
    body: req.body
  })

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Criar cliente Supabase com variáveis de ambiente
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

    console.log('Variáveis Supabase:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey
    })

    if (!supabaseUrl || !supabaseKey) {
      console.error('Variáveis do Supabase não encontradas')
      return res.status(500).json({ error: 'Configuração do Supabase não encontrada' })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { email, password } = req.body

    console.log('Dados recebidos:', { email, password: password ? '***' : 'undefined' })

    // Validar dados
    if (!email || !password) {
      console.log('Dados inválidos:', { email, hasPassword: !!password })
      return res.status(400).json({ error: 'Email e senha são obrigatórios' })
    }

    // Autenticar com Supabase
    console.log('Tentando autenticar com Supabase...')
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      console.error('Erro de autenticação:', error)
      return res.status(401).json({ error: 'Credenciais inválidas' })
    }

    console.log('Autenticação bem-sucedida:', { userId: data.user.id })

    // Usar dados do usuário autenticado
    const response = {
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || data.user.email,
        isAdmin: data.user.email === 'adminfhd@fhd.com' // Definir admin baseado no email
      },
      token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    }

    console.log('Resposta de sucesso:', { userId: response.user.id, email: response.user.email })
    return res.status(200).json(response)

  } catch (error) {
    console.error('Erro na API de login:', error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
} 