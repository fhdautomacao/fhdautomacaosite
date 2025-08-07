import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  console.log('API Dashboard chamada:', {
    method: req.method,
    headers: req.headers
  })

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

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

    // Buscar dados do dashboard
    const dashboardData = await getDashboardData(supabase, user.id)
    
    return res.status(200).json(dashboardData)

  } catch (error) {
    console.error('Erro na API de dashboard:', error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

async function getDashboardData(supabase, userId) {
  try {
    // Buscar contadores
    const [
      billsCount,
      quotationsCount,
      clientsCount,
      overdueBillsCount
    ] = await Promise.all([
      // Total de bills
      supabase
        .from('bills')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId),
      
      // Total de quotations
      supabase
        .from('quotations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId),
      
      // Total de clients
      supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId),
      
      // Bills vencidos
      supabase
        .from('bills')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'overdue')
    ])

    // Buscar dados recentes
    const [
      recentBills,
      recentQuotations,
      recentClients
    ] = await Promise.all([
      // Bills recentes
      supabase
        .from('bills')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5),
      
      // Quotations recentes
      supabase
        .from('quotations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5),
      
      // Clients recentes
      supabase
        .from('clients')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5)
    ])

    // Calcular totais
    const totalBills = billsCount.count || 0
    const totalQuotations = quotationsCount.count || 0
    const totalClients = clientsCount.count || 0
    const totalOverdue = overdueBillsCount.count || 0

    // Calcular valores
    const billsData = recentBills.data || []
    const totalAmount = billsData.reduce((sum, bill) => sum + (parseFloat(bill.amount) || 0), 0)
    const pendingAmount = billsData
      .filter(bill => bill.status === 'pending')
      .reduce((sum, bill) => sum + (parseFloat(bill.amount) || 0), 0)

    const dashboardData = {
      summary: {
        totalBills,
        totalQuotations,
        totalClients,
        totalOverdue,
        totalAmount: totalAmount.toFixed(2),
        pendingAmount: pendingAmount.toFixed(2)
      },
      recent: {
        bills: recentBills.data || [],
        quotations: recentQuotations.data || [],
        clients: recentClients.data || []
      },
      charts: {
        billsByStatus: {
          pending: billsData.filter(bill => bill.status === 'pending').length,
          paid: billsData.filter(bill => bill.status === 'paid').length,
          overdue: billsData.filter(bill => bill.status === 'overdue').length
        }
      },
      lastUpdated: new Date().toISOString()
    }

    console.log('Dashboard data gerado:', {
      totalBills,
      totalQuotations,
      totalClients,
      totalOverdue
    })

    return dashboardData

  } catch (error) {
    console.error('Erro ao gerar dashboard data:', error)
    throw error
  }
}
