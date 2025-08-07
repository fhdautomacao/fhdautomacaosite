import { supabase } from '../../src/lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, password } = req.body

    // Validar dados
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' })
    }

    // Autenticar com Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      console.error('Erro de autenticação:', error)
      return res.status(401).json({ error: 'Credenciais inválidas' })
    }

    // Buscar dados do usuário
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single()

    if (userError) {
      console.error('Erro ao buscar dados do usuário:', userError)
    }

    // Retornar dados do usuário
    return res.status(200).json({
      user: {
        id: data.user.id,
        email: data.user.email,
        name: userData?.name || data.user.email,
        isAdmin: userData?.is_admin || false,
      },
      token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    })

  } catch (error) {
    console.error('Erro na API de login:', error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
} 