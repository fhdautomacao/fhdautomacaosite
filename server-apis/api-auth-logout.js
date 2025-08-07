import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  console.log('API Logout chamada:', {
    method: req.method,
    headers: req.headers
  })

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Criar cliente Supabase com variáveis de ambiente
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error('Variáveis do Supabase não encontradas')
      return res.status(500).json({ error: 'Configuração do Supabase não encontrada' })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

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
