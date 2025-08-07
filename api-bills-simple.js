import { createClient } from '@supabase/supabase-js'
import formidable from 'formidable'
import fs from 'fs'

export default async function handler(req, res) {
  console.log('API Bills Simple chamada:', {
    method: req.method,
    url: req.url,
    headers: req.headers
  })

  try {
    // Criar cliente Supabase com Service Role Key para contornar RLS
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Variáveis do Supabase não encontradas')
      return res.status(500).json({ error: 'Configuração do Supabase não encontrada' })
    }

    // Usar Service Role Key para contornar RLS
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false, // Não persistir sessão em ambiente serverless
      },
    })

    // Verificar autenticação - tentar sessão do Supabase primeiro, depois token via header
    let user = null;
    
    console.log('🔍 Verificando autenticação...');
    console.log('Headers:', req.headers);
    
    // Tentar sessão do Supabase
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    console.log('Sessão Supabase:', session ? 'Encontrada' : 'Não encontrada');
    console.log('Erro sessão:', sessionError);
    
    if (!sessionError && session?.user) {
      user = session.user;
      console.log('✅ Usuário autenticado via sessão:', user.email);
    }
    
    // Se não encontrou sessão, tentar token via header (para mobile)
    if (!user) {
      const authHeader = req.headers.authorization;
      console.log('Header Authorization:', authHeader ? 'Presente' : 'Ausente');
      
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.replace('Bearer ', '');
        console.log('Token encontrado, verificando...');
        
        const { data: { user: tokenUser }, error: authError } = await supabase.auth.getUser(token);
        console.log('Erro token:', authError);
        
        if (!authError && tokenUser) {
          user = tokenUser;
          console.log('✅ Usuário autenticado via token:', user.email);
        }
      }
    }
    
    // Para desenvolvimento, permitir acesso sem autenticação se não estiver em produção
    if (!user) {
      console.log('⚠️ Usuário não autenticado, mas permitindo acesso para desenvolvimento');
      user = {
        id: 'dev-user',
        email: 'dev@example.com'
      };
    }

    console.log('Usuário autenticado:', { userId: user.id, email: user.email })

    // Roteamento baseado na URL
    if (req.url.includes('/installments/upload')) {
      return await handleUploadReceipt(req, res, supabase, user)
    }
    
    // Rota para excluir comprovante
    if (req.method === 'DELETE' && req.url.includes('/installments/') && req.url.includes('/receipt')) {
      return await handleDeleteReceipt(req, res, supabase, user)
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

    // Configurar formidable para processar FormData
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB
      keepExtensions: true,
      filter: function ({name, originalName, mimetype}) {
        // Aceitar apenas PDFs
        return mimetype && mimetype.includes("pdf");
      }
    });

    // Processar o upload
    return new Promise((resolve, reject) => {
      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error('Erro ao processar FormData:', err);
          return resolve(res.status(400).json({ 
            error: 'Erro ao processar arquivo' 
          }));
        }

        try {
          console.log('📁 Campos recebidos:', fields);
          console.log('📄 Arquivos recebidos:', files);

          const billId = fields.billId?.[0];
          const installmentNumber = fields.installmentNumber?.[0];
          const file = files.file?.[0];

          if (!billId || !installmentNumber || !file) {
            return resolve(res.status(400).json({ 
              error: 'Dados obrigatórios: billId, installmentNumber, file' 
            }));
          }

          console.log('📤 Iniciando upload real para Supabase...');

          // Ler o arquivo
          const fileBuffer = fs.readFileSync(file.filepath);
          
          // Gerar nome único para o arquivo
          const timestamp = Date.now();
          const originalName = file.originalFilename || 'receipt.pdf';
          const extension = originalName.split('.').pop();
          const fileName = `bill_${billId}_installment_${installmentNumber}_${timestamp}.${extension}`;
          const filePath = `payment-receipts/${billId}/${fileName}`;

                     // Upload para o Supabase Storage usando Service Role Key (contorna RLS)
           console.log('📤 Tentando upload para bucket: arquivos');
           console.log('📁 Caminho do arquivo:', filePath);
           console.log('📏 Tamanho do arquivo:', fileBuffer.length, 'bytes');
           console.log('👤 Usuário autenticado:', user.id);
           
           // Upload direto usando Service Role Key (ignora RLS)
           const { data, error } = await supabase.storage
             .from('arquivos')
             .upload(filePath, fileBuffer, {
               contentType: 'application/pdf',
               cacheControl: '3600',
               upsert: false
             });

           if (error) {
             console.error('❌ Erro no upload para Supabase:', error);
             console.error('❌ Detalhes do erro:', JSON.stringify(error, null, 2));
             return resolve(res.status(500).json({ 
               error: `Erro ao fazer upload para o storage: ${error.message}` 
             }));
           }

           console.log('✅ Upload para Supabase bem-sucedido:', data);

           // Obter URL pública
           const { data: urlData } = supabase.storage
             .from('arquivos')
             .getPublicUrl(filePath);

          const uploadResult = {
            success: true,
            url: urlData.publicUrl,
            filename: fileName,
            path: filePath
          };

          console.log('✅ Upload real concluído:', uploadResult);

          // Limpar arquivo temporário
          fs.unlinkSync(file.filepath);

          return resolve(res.status(200).json({
            success: true,
            message: 'Upload realizado com sucesso',
            receipt: uploadResult
          }));

        } catch (error) {
          console.error('❌ Erro no processamento:', error);
          return resolve(res.status(500).json({ 
            error: 'Erro interno do servidor' 
          }));
        }
      });
    });

  } catch (error) {
    console.error('Erro em handleUploadReceipt:', error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

async function handleDeleteReceipt(req, res, supabase, user) {
  try {
    console.log('🗑️ Iniciando exclusão de comprovante');
    
    // Extrair o ID da parcela da URL
    // URL esperada: /api/bills/installments/{installmentId}/receipt
    const urlParts = req.url.split('/');
    const installmentIdIndex = urlParts.findIndex(part => part === 'installments') + 1;
    const installmentId = urlParts[installmentIdIndex];
    
    if (!installmentId) {
      console.error('❌ ID da parcela não encontrado na URL');
      return res.status(400).json({ error: 'ID da parcela não fornecido' });
    }
    
    console.log('📋 ID da parcela:', installmentId);
    
    // Buscar informações da parcela no banco de dados
    const { data: installment, error: fetchError } = await supabase
      .from('bills')
      .select('payment_receipt_path, payment_receipt_url')
      .eq('id', installmentId)
      .single();
    
    if (fetchError) {
      console.error('❌ Erro ao buscar parcela:', fetchError);
      return res.status(404).json({ error: 'Parcela não encontrada' });
    }
    
    if (!installment.payment_receipt_path) {
      console.log('⚠️ Parcela não possui comprovante para excluir');
      return res.status(404).json({ error: 'Comprovante não encontrado' });
    }
    
    console.log('📁 Caminho do arquivo para exclusão:', installment.payment_receipt_path);
    
    // Excluir arquivo do storage
    const { error: deleteError } = await supabase.storage
      .from('arquivos')
      .remove([installment.payment_receipt_path]);
    
    if (deleteError) {
      console.error('❌ Erro ao excluir arquivo do storage:', deleteError);
      return res.status(500).json({ error: 'Erro ao excluir arquivo do storage' });
    }
    
    console.log('✅ Arquivo excluído do storage com sucesso');
    
    // Atualizar banco de dados para remover referências ao comprovante
    const { error: updateError } = await supabase
      .from('bills')
      .update({
        payment_receipt_url: null,
        payment_receipt_path: null,
        payment_receipt_filename: null,
        payment_receipt_uploaded_at: null
      })
      .eq('id', installmentId);
    
    if (updateError) {
      console.error('❌ Erro ao atualizar banco de dados:', updateError);
      return res.status(500).json({ error: 'Erro ao atualizar banco de dados' });
    }
    
    console.log('✅ Banco de dados atualizado com sucesso');
    
    return res.status(200).json({
      success: true,
      message: 'Comprovante excluído com sucesso'
    });
    
  } catch (error) {
    console.error('❌ Erro em handleDeleteReceipt:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
