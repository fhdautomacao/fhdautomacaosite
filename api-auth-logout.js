import { supabase } from './src/lib/supabase'

export default async function handler(req, res) {
  console.log('API Logout chamada:', {
    method: req.method,
    headers: req.headers
  })

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Fazer logout do Supabase
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Erro no logout:', error)
      return res.status(500).json({ error: 'Erro ao fazer logout' })
    }

    console.log('Logout bem-sucedido')
    return res.status(200).json({ message: 'Logout realizado com sucesso' })

  } catch (error) {
    console.error('Erro na API de logout:', error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}
