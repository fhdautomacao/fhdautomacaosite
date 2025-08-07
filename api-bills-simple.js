import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  console.log('API Bills Simple chamada:', {
    method: req.method,
    url: req.url,
    headers: req.headers
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

    // Roteamento baseado na URL
    if (req.url.includes('/installments/upload')) {
      return await handleUploadReceipt(req, res, supabase, user)
    }

    // Para outras rotas, retornar erro por enquanto
    return res.status(404).json({ error: 'Endpoint não encontrado' })

  } catch (error) {
    console.error('Erro na API de bills:', error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

async function handleUploadReceipt(req, res, supabase, user) {
  try {
    console.log('Iniciando handleUploadReceipt');
    console.log('Content-Type:', req.headers['content-type']);
    console.log('Body length:', req.body ? Object.keys(req.body).length : 'Body vazio');

    // Para desenvolvimento, vamos retornar uma resposta de teste
    return res.status(200).json({
      success: true,
      message: 'API funcionando corretamente',
      test: true,
      body: req.body ? 'Body presente' : 'Body vazio',
      contentType: req.headers['content-type']
    });

  } catch (error) {
    console.error('Erro em handleUploadReceipt:', error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}
