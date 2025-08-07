import { createClient } from '@supabase/supabase-js'
import uploadService from '../src/services/uploadService.js'

export default async function handler(req, res) {
  console.log('API Bills chamada:', {
    method: req.method,
    headers: req.headers,
    query: req.query,
    url: req.url
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

    // Extrair billId da URL se presente
    const urlParts = req.url.split('/')
    const billId = urlParts[urlParts.length - 1]
    const isSpecificBill = billId && billId !== 'api' && billId !== 'bills'

    // Inicializar pasta de comprovantes no bucket existente
    await uploadService.initializeReceiptsFolder()

    switch (req.method) {
      case 'GET':
        if (isSpecificBill) {
          return await handleGetBillById(req, res, supabase, billId)
        } else {
          return await handleGetBills(req, res, supabase)
        }
      case 'POST':
        if (req.url.includes('/installments/')) {
          return await handleUploadReceipt(req, res, supabase, user)
        } else {
          return await handleCreateBill(req, res, supabase, user)
        }
      case 'PUT':
        if (isSpecificBill) {
          return await handleUpdateBill(req, res, supabase, billId, user)
        } else if (req.url.includes('/installments/')) {
          return await handleUpdateInstallment(req, res, supabase, user)
        }
      case 'DELETE':
        if (isSpecificBill) {
          return await handleDeleteBill(req, res, supabase, billId)
        }
      default:
        return res.status(405).json({ error: 'Method not allowed' })
    }

  } catch (error) {
    console.error('Erro na API de bills:', error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

async function handleGetBills(req, res, supabase) {
  try {
    const { status, page = 1, limit = 50 } = req.query
    
    let query = supabase
      .from('bills')
      .select(`
        *,
        bill_installments (
          id,
          installment_number,
          due_date,
          amount,
          status,
          paid_date,
          payment_notes,
          payment_receipt_url,
          payment_receipt_filename,
          payment_receipt_uploaded_at
        )
      `)
      .order('created_at', { ascending: false })

    // Aplicar filtros
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    // Paginação
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)

    const { data: bills, error } = await query

    if (error) {
      console.error('Erro ao buscar bills:', error)
      return res.status(500).json({ error: 'Erro ao buscar bills' })
    }

    console.log('Bills encontrados:', bills.length)
    return res.status(200).json({
      data: bills,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: bills.length
      }
    })

  } catch (error) {
    console.error('Erro em handleGetBills:', error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

async function handleGetBillById(req, res, supabase, billId) {
  try {
    const { data: bill, error } = await supabase
      .from('bills')
      .select(`
        *,
        bill_installments (
          id,
          installment_number,
          due_date,
          amount,
          status,
          paid_date,
          payment_notes,
          payment_receipt_url,
          payment_receipt_filename,
          payment_receipt_uploaded_at,
          payment_receipt_uploaded_by
        )
      `)
      .eq('id', billId)
      .single()

    if (error) {
      console.error('Erro ao buscar bill:', error)
      return res.status(404).json({ error: 'Bill não encontrado' })
    }

    return res.status(200).json(bill)

  } catch (error) {
    console.error('Erro em handleGetBillById:', error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

async function handleCreateBill(req, res, supabase, user) {
  try {
    const billData = req.body

    // Validar dados obrigatórios
    if (!billData.company_name || !billData.total_amount || !billData.first_due_date) {
      return res.status(400).json({ 
        error: 'Dados obrigatórios: company_name, total_amount, first_due_date' 
      })
    }

    // Adicionar dados do usuário
    const newBill = {
      ...billData,
      created_by: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { data: bill, error } = await supabase
      .from('bills')
      .insert(newBill)
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar bill:', error)
      return res.status(500).json({ error: 'Erro ao criar bill' })
    }

    // Criar parcelas automaticamente
    await createInstallments(supabase, bill.id, billData)

    console.log('Bill criado:', { billId: bill.id, companyName: bill.company_name })
    return res.status(201).json(bill)

  } catch (error) {
    console.error('Erro em handleCreateBill:', error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

async function createInstallments(supabase, billId, billData) {
  try {
    const installments = []
    const installmentAmount = billData.total_amount / billData.installments
    const firstDueDate = new Date(billData.first_due_date)

    for (let i = 0; i < billData.installments; i++) {
      const dueDate = new Date(firstDueDate)
      dueDate.setDate(dueDate.getDate() + (i * billData.installment_interval))

      installments.push({
        bill_id: billId,
        installment_number: i + 1,
        due_date: dueDate.toISOString().split('T')[0],
        amount: installmentAmount,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    }

    const { error } = await supabase
      .from('bill_installments')
      .insert(installments)

    if (error) {
      console.error('Erro ao criar parcelas:', error)
      throw error
    }

    console.log('Parcelas criadas:', installments.length)
  } catch (error) {
    console.error('Erro em createInstallments:', error)
    throw error
  }
}

async function handleUpdateBill(req, res, supabase, billId, user) {
  try {
    const updateData = req.body

    const { data: bill, error } = await supabase
      .from('bills')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', billId)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar bill:', error)
      return res.status(500).json({ error: 'Erro ao atualizar bill' })
    }

    return res.status(200).json(bill)

  } catch (error) {
    console.error('Erro em handleUpdateBill:', error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

async function handleUpdateInstallment(req, res, supabase, user) {
  try {
    const { installmentId } = req.body
    const updateData = req.body

    const { data: installment, error } = await supabase
      .from('bill_installments')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', installmentId)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar parcela:', error)
      return res.status(500).json({ error: 'Erro ao atualizar parcela' })
    }

    return res.status(200).json(installment)

  } catch (error) {
    console.error('Erro em handleUpdateInstallment:', error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

async function handleUploadReceipt(req, res, supabase, user) {
  try {
    const { billId, installmentNumber, file } = req.body

    if (!billId || !installmentNumber || !file) {
      return res.status(400).json({ 
        error: 'Dados obrigatórios: billId, installmentNumber, file' 
      })
    }

    // Verificar se a parcela existe
    const { data: installment, error: installmentError } = await supabase
      .from('bill_installments')
      .select('*')
      .eq('bill_id', billId)
      .eq('installment_number', installmentNumber)
      .single()

    if (installmentError || !installment) {
      return res.status(404).json({ error: 'Parcela não encontrada' })
    }

    // Fazer upload do arquivo
    const uploadResult = await uploadService.uploadPaymentReceipt(
      file, 
      billId, 
      installmentNumber
    )

    if (!uploadResult.success) {
      return res.status(400).json({ error: uploadResult.error })
    }

    // Atualizar parcela com informações do comprovante
    const { data: updatedInstallment, error: updateError } = await supabase
      .from('bill_installments')
      .update({
        payment_receipt_url: uploadResult.url,
        payment_receipt_filename: uploadResult.filename,
        payment_receipt_uploaded_at: new Date().toISOString(),
        payment_receipt_uploaded_by: user.id,
        status: 'paid',
        paid_date: new Date().toISOString()
      })
      .eq('id', installment.id)
      .select()
      .single()

    if (updateError) {
      console.error('Erro ao atualizar parcela:', updateError)
      return res.status(500).json({ error: 'Erro ao atualizar parcela' })
    }

    return res.status(200).json({
      success: true,
      installment: updatedInstallment,
      receipt: {
        url: uploadResult.url,
        filename: uploadResult.filename
      }
    })

  } catch (error) {
    console.error('Erro em handleUploadReceipt:', error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

async function handleDeleteBill(req, res, supabase, billId) {
  try {
    // Deletar parcelas primeiro (cascade)
    const { error: installmentsError } = await supabase
      .from('bill_installments')
      .delete()
      .eq('bill_id', billId)

    if (installmentsError) {
      console.error('Erro ao deletar parcelas:', installmentsError)
      return res.status(500).json({ error: 'Erro ao deletar parcelas' })
    }

    // Deletar bill
    const { error } = await supabase
      .from('bills')
      .delete()
      .eq('id', billId)

    if (error) {
      console.error('Erro ao deletar bill:', error)
      return res.status(500).json({ error: 'Erro ao deletar bill' })
    }

    return res.status(200).json({ success: true })

  } catch (error) {
    console.error('Erro em handleDeleteBill:', error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}
