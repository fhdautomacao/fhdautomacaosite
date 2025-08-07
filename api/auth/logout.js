import { supabase } from '../../src/lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { refresh_token } = req.body

    if (refresh_token) {
      // Fazer logout no Supabase
      const { error } = await supabase.auth.refreshSession({
        refresh_token
      })

      if (error) {
        console.error('Erro ao fazer logout:', error)
      }
    }

    return res.status(200).json({ 
      success: true,
      message: 'Logout realizado com sucesso' 
    })

  } catch (error) {
    console.error('Erro na API de logout:', error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
} 