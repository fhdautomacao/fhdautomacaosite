import { supabase } from '../lib/supabase'

export const profitSharingAPI = {
  // Criar nova divisão de lucro
  async create(profitSharingData) {
    const { data, error } = await supabase
      .from('profit_sharing')
      .insert([profitSharingData])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Buscar todas as divisões de lucro
  async getAll() {
    const { data, error } = await supabase
      .from('profit_sharing')
      .select(`
        *,
        profit_sharing_installments (*)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Buscar divisão de lucro por ID
  async getById(id) {
    const { data, error } = await supabase
      .from('profit_sharing')
      .select(`
        *,
        profit_sharing_installments (*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Buscar divisões por empresa
  async getByCompany(companyId) {
    const { data, error } = await supabase
      .from('profit_sharing')
      .select(`
        *,
        profit_sharing_installments (*)
      `)
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Buscar divisões por status
  async getByStatus(status) {
    const { data, error } = await supabase
      .from('profit_sharing')
      .select(`
        *,
        profit_sharing_installments (*)
      `)
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Atualizar divisão de lucro
  async update(id, updates) {
    const { data, error } = await supabase
      .from('profit_sharing')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Deletar divisão de lucro
  async delete(id) {
    const { error } = await supabase
      .from('profit_sharing')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Gerar parcelas para pagamento do sócio
  async generateInstallments(profitSharingId, partnerShare, installments, installmentInterval, firstDueDate) {
    const installmentAmount = partnerShare / installments
    const installmentsData = []

    for (let i = 0; i < installments; i++) {
      const dueDate = new Date(firstDueDate)
      dueDate.setDate(dueDate.getDate() + (i * installmentInterval))

      installmentsData.push({
        profit_sharing_id: profitSharingId,
        installment_number: i + 1,
        due_date: dueDate.toISOString().split('T')[0],
        amount: installmentAmount,
        status: 'pending'
      })
    }

    const { data, error } = await supabase
      .from('profit_sharing_installments')
      .insert(installmentsData)
      .select()

    if (error) throw error
    return data
  },

  // Buscar parcelas de uma divisão
  async getInstallments(profitSharingId) {
    const { data, error } = await supabase
      .from('profit_sharing_installments')
      .select('*')
      .eq('profit_sharing_id', profitSharingId)
      .order('installment_number')

    if (error) throw error
    return data
  },

  // Atualizar parcela
  async updateInstallment(installmentId, updates) {
    const { data, error } = await supabase
      .from('profit_sharing_installments')
      .update(updates)
      .eq('id', installmentId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Contar divisões por status
  async getCountByStatus(status) {
    const { count, error } = await supabase
      .from('profit_sharing')
      .select('*', { count: 'exact', head: true })
      .eq('status', status)

    if (error) throw error
    return count
  },

  // Buscar parcelas pendentes (vencidas)
  async getOverdueInstallments() {
    const today = new Date().toISOString().split('T')[0]
    
    const { data, error } = await supabase
      .from('profit_sharing_installments')
      .select(`
        *,
        profit_sharing (company_name, bill_description)
      `)
      .eq('status', 'pending')
      .lt('due_date', today)
      .order('due_date')

    if (error) throw error
    return data
  },

  // Buscar todas as parcelas com estatísticas
  async getAllInstallments() {
    const { data, error } = await supabase
      .from('profit_sharing_installments')
      .select(`
        *,
        profit_sharing (company_name, bill_description)
      `)
      .order('due_date')

    if (error) throw error
    return data
  },

  // Calcular estatísticas financeiras
  async getFinancialStatistics() {
    try {
      // Buscar todas as parcelas
      const installments = await this.getAllInstallments()
      
      const today = new Date().toISOString().split('T')[0]
      
      const stats = {
        totalToPay: 0,
        totalPaid: 0,
        totalPending: 0,
        totalOverdue: 0,
        averageProfit: 0
      }

      // Calcular totais das parcelas
      installments.forEach(installment => {
        const amount = parseFloat(installment.amount)
        
        if (installment.status === 'paid') {
          stats.totalPaid += amount
        } else if (installment.status === 'pending') {
          stats.totalPending += amount
          
          // Verificar se está vencida
          if (installment.due_date < today) {
            stats.totalOverdue += amount
          }
        }
        
        stats.totalToPay += amount
      })

      // Calcular lucro médio das divisões
      const { data: profitSharings } = await supabase
        .from('profit_sharing')
        .select('profit')

      if (profitSharings && profitSharings.length > 0) {
        const totalProfit = profitSharings.reduce((sum, ps) => sum + parseFloat(ps.profit || 0), 0)
        stats.averageProfit = totalProfit / profitSharings.length
      }

      return stats
    } catch (error) {
      console.error('Erro ao calcular estatísticas:', error)
      throw error
    }
  },

  // Atualizar status de pagamentos vencidos
  async updateOverdueStatus() {
    const today = new Date().toISOString().split('T')[0]
    try {
      // Atualizar installments vencidas
      const { data: updatedInstallments, error: installmentsError } = await supabase
        .from('profit_sharing_installments')
        .update({ status: 'overdue', updated_at: new Date().toISOString() })
        .eq('status', 'pending')
        .lt('due_date', today)
        .select(`
          *,
          profit_sharing (
            company_name,
            profit,
            partner_share
          )
        `)

      if (installmentsError) throw installmentsError

      console.log('📊 Parcelas de divisão de lucro atualizadas para vencidas:', updatedInstallments?.length || 0)

      return {
        updatedInstallments: updatedInstallments || [],
        total: updatedInstallments?.length || 0
      }
    } catch (error) {
      console.error('Erro ao atualizar status de pagamentos de sócio vencidos:', error)
      throw error
    }
  },

  // Buscar pagamentos pendentes e vencidos
  async getPendingOverdue() {
    const today = new Date().toISOString().split('T')[0]
    
    try {
      const { data: overdueInstallments, error } = await supabase
        .from('profit_sharing_installments')
        .select(`
          *,
          profit_sharing (
            company_name,
            profit,
            partner_share
          )
        `)
        .eq('status', 'overdue')
        .order('due_date', { ascending: true })

      if (error) throw error

      return overdueInstallments || []
    } catch (error) {
      console.error('Erro ao buscar pagamentos de sócio vencidos:', error)
      throw error
    }
  },

  // Buscar pagamentos que vencem em breve (próximos 7 dias)
  async getUpcomingPayments(days = 7) {
    const today = new Date()
    const futureDate = new Date(today.getTime() + (days * 24 * 60 * 60 * 1000))
    
    try {
      const { data: upcomingInstallments, error } = await supabase
        .from('profit_sharing_installments')
        .select(`
          *,
          profit_sharing (
            company_name,
            profit,
            partner_share
          )
        `)
        .eq('status', 'pending')
        .gte('due_date', today.toISOString().split('T')[0])
        .lte('due_date', futureDate.toISOString().split('T')[0])
        .order('due_date', { ascending: true })

      if (error) throw error

      return upcomingInstallments || []
    } catch (error) {
      console.error('Erro ao buscar pagamentos de sócio próximos:', error)
      throw error
    }
  }
}