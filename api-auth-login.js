import { supabase } from './src/lib/supabase'

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

    // Buscar dados do usuário
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single()

    if (userError) {
      console.error('Erro ao buscar dados do usuário:', userError)
    }

    const response = {
      user: {
        id: data.user.id,
        email: data.user.email,
        name: userData?.name || data.user.email,
        isAdmin: userData?.is_admin || false,
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
