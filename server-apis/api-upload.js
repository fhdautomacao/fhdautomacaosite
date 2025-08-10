import { createClient } from '@supabase/supabase-js'
import multer from 'multer'
import path from 'path'

// Configurar multer para upload de arquivos
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
  fileFilter: (req, file, cb) => {
    // Permitir apenas imagens
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Tipo de arquivo não permitido. Use apenas imagens.'), false)
    }
  }
})

export default async function handler(req, res) {
  console.log('🚀 [UPLOAD] Requisição recebida:', req.method, req.url)
  
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  try {
    // Verificar autenticação JWT
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token de autenticação necessário' })
    }

    const token = authHeader.substring(7)
    
    // Criar cliente Supabase com service role key para contornar RLS
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ [UPLOAD] Variáveis do Supabase não configuradas')
      return res.status(500).json({ error: 'Configuração do Supabase não encontrada' })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Processar upload usando multer
    upload.single('file')(req, res, async (err) => {
      if (err) {
        console.error('❌ [UPLOAD] Erro no multer:', err)
        return res.status(400).json({ error: err.message })
      }

      try {
        const file = req.file
        const { folder = 'uploads' } = req.body

        if (!file) {
          return res.status(400).json({ error: 'Nenhum arquivo enviado' })
        }

        console.log('📤 [UPLOAD] Processando arquivo:', {
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          folder
        })

        // Gerar nome único para o arquivo
        const timestamp = Date.now()
        const extension = path.extname(file.originalname)
        const fileName = `${timestamp}${extension}`
        const filePath = `${folder}/${fileName}`

        // Upload para o Supabase Storage usando service role key
        const { data, error } = await supabase.storage
          .from('arquivos')
          .upload(filePath, file.buffer, {
            contentType: file.mimetype,
            cacheControl: '3600',
            upsert: false
          })

        if (error) {
          console.error('❌ [UPLOAD] Erro no upload para Supabase:', error)
          return res.status(500).json({ 
            error: 'Erro ao fazer upload para o storage',
            details: error.message
          })
        }

        // Obter URL pública
        const { data: urlData } = supabase.storage
          .from('arquivos')
          .getPublicUrl(filePath)

        console.log('✅ [UPLOAD] Upload concluído:', {
          path: filePath,
          url: urlData.publicUrl
        })

        return res.status(200).json({
          success: true,
          data: {
            path: filePath,
            url: urlData.publicUrl,
            filename: fileName,
            originalName: file.originalname,
            size: file.size,
            mimetype: file.mimetype
          }
        })

      } catch (error) {
        console.error('❌ [UPLOAD] Erro no processamento:', error)
        return res.status(500).json({ error: 'Erro interno do servidor' })
      }
    })

  } catch (error) {
    console.error('❌ [UPLOAD] Erro geral:', error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}
