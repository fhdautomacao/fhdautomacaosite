import { useEffect, useCallback } from 'react'
import pushNotificationService from '@/services/pushNotificationService'
import { useJWTAuth } from '@/contexts/JWTAuthContext'

/**
 * Hook para gerenciar notificações push
 */
export const useNotifications = () => {
  const { user } = useJWTAuth()
  
  // Inicializar notificações automaticamente
  useEffect(() => {
    // Só inicializar se o usuário estiver autenticado
    if (!user) {
      return
    }

    const initNotifications = async () => {
      // Só executar se o usuário estiver autenticado
      if (!user) {
        return
      }

      try {
        const status = await pushNotificationService.getStatus()
        if (status.supported && !status.configured) {
          console.log('📱 Notificações disponíveis mas não configuradas')
        }
      } catch (error) {
        // Ignorar erros de CORS ou rede quando não autenticado
        if (error.message && (
          error.message.includes('NetworkError') || 
          error.message.includes('CORS') ||
          error.message.includes('fetch')
        )) {
          console.log('ℹ️ Verificação de notificações ignorada (usuário não autenticado)')
          return
        }
        console.error('Erro ao verificar status de notificações:', error)
      }
    }
    
    initNotifications()
  }, [user])

  // Enviar notificação de boletos vencidos
  const notifyOverdueBills = useCallback(async (count, bills = []) => {
    try {
      const isConfigured = await pushNotificationService.isConfigured()
      if (!isConfigured) return false

      const title = count === 1 ? 
        '🚨 Boleto Vencido!' : 
        `🚨 ${count} Boletos Vencidos!`

      let body = count === 1 ? 
        'Você tem 1 boleto em atraso.' :
        `Você tem ${count} boletos em atraso.`

      // Adicionar detalhes do primeiro boleto
      if (bills.length > 0) {
        const firstBill = bills[0]
        body += ` Primeiro: ${firstBill.company_name || 'Empresa'} - R$ ${firstBill.total_amount || '0,00'}`
      }

      await pushNotificationService.sendLocalNotification(title, {
        body,
        icon: '/logo.png',
        badge: '/logo.png',
        vibrate: [300, 100, 300],
        data: {
          url: '/admin-fhd',
          section: 'bills',
          type: 'overdue'
        },
        actions: [
          {
            action: 'view',
            title: 'Ver Boletos',
            icon: '/logo.png'
          }
        ],
        requireInteraction: true,
        tag: 'overdue-bills'
      })

      console.log('🔔 Notificação de boletos vencidos enviada')
      return true
    } catch (error) {
      console.error('Erro ao enviar notificação de boletos vencidos:', error)
      return false
    }
  }, [])

  // Enviar notificação de novos orçamentos
  const notifyNewQuotations = useCallback(async (count) => {
    try {
      const isConfigured = await pushNotificationService.isConfigured()
      if (!isConfigured) return false

      const title = count === 1 ? 
        '📝 Novo Orçamento!' : 
        `📝 ${count} Novos Orçamentos!`

      const body = count === 1 ? 
        'Você recebeu uma nova solicitação de orçamento.' :
        `Você recebeu ${count} novas solicitações de orçamento.`

      await pushNotificationService.sendLocalNotification(title, {
        body,
        icon: '/logo.png',
        badge: '/logo.png',
        vibrate: [200, 100, 200],
        data: {
          url: '/admin-fhd',
          section: 'quotations',
          type: 'new'
        },
        tag: 'new-quotations'
      })

      console.log('🔔 Notificação de novos orçamentos enviada')
      return true
    } catch (error) {
      console.error('Erro ao enviar notificação de orçamentos:', error)
      return false
    }
  }, [])

  // Enviar notificação de divisão de lucros
  const notifyProfitSharing = useCallback(async (type, data) => {
    try {
      const isConfigured = await pushNotificationService.isConfigured()
      if (!isConfigured) return false

      let title, body, vibrate

      switch (type) {
        case 'payment_due':
          title = '💰 Pagamento de Sócio Vencendo'
          body = `Pagamento para ${data.company} vence em ${data.days} dias`
          vibrate = [200, 100, 200]
          break
        case 'payment_overdue':
          const count = data.count || 1
          title = count === 1 ? 
            '🚨 Pagamento de Sócio Vencido!' : 
            `🚨 ${count} Pagamentos de Sócio Vencidos!`
          
          if (count === 1 && data.payments && data.payments.length > 0) {
            const payment = data.payments[0]
            const companyName = payment.profit_sharing?.company_name || 'Empresa'
            const amount = payment.amount || 0
            body = `Pagamento para ${companyName} vencido - R$ ${amount.toFixed(2)}`
          } else {
            body = count === 1 ? 
              'Você tem 1 pagamento de sócio em atraso.' :
              `Você tem ${count} pagamentos de sócio em atraso.`
          }
          vibrate = [300, 100, 300, 100, 300]
          break
        case 'upcoming_payment':
          title = '⏰ Pagamento de Sócio Próximo'
          body = `Pagamento para ${data.company} vence em ${data.days} dias`
          vibrate = [200, 100, 200]
          break
        default:
          title = '💰 Divisão de Lucros'
          body = 'Atualização na divisão de lucros'
          vibrate = [200, 100, 200]
      }

      await pushNotificationService.sendLocalNotification(title, {
        body,
        icon: '/logo.png',
        badge: '/logo.png',
        vibrate,
        data: {
          url: '/admin-fhd',
          section: 'profit-sharing',
          type
        },
        actions: [
          {
            action: 'view',
            title: 'Ver Pagamentos',
            icon: '/logo.png'
          }
        ],
        requireInteraction: true,
        tag: 'profit-sharing'
      })

      console.log('🔔 Notificação de divisão de lucros enviada')
      return true
    } catch (error) {
      console.error('Erro ao enviar notificação de divisão de lucros:', error)
      return false
    }
  }, [])

  // Enviar notificação personalizada
  const sendCustomNotification = useCallback(async (title, options = {}) => {
    try {
      const isConfigured = await pushNotificationService.isConfigured()
      if (!isConfigured) return false

      await pushNotificationService.sendLocalNotification(title, {
        icon: '/logo.png',
        badge: '/logo.png',
        vibrate: [200, 100, 200],
        data: {
          url: '/admin-fhd'
        },
        ...options
      })

      console.log('🔔 Notificação personalizada enviada')
      return true
    } catch (error) {
      console.error('Erro ao enviar notificação personalizada:', error)
      return false
    }
  }, [])

  // Verificar se notificações estão configuradas
  const isNotificationsEnabled = useCallback(async () => {
    try {
      return await pushNotificationService.isConfigured()
    } catch (error) {
      console.error('Erro ao verificar status de notificações:', error)
      return false
    }
  }, [])

  // Configurar notificações
  const setupNotifications = useCallback(async () => {
    try {
      return await pushNotificationService.setup()
    } catch (error) {
      console.error('Erro ao configurar notificações:', error)
      return false
    }
  }, [])

  return {
    notifyOverdueBills,
    notifyNewQuotations,
    notifyProfitSharing,
    sendCustomNotification,
    isNotificationsEnabled,
    setupNotifications
  }
}

export default useNotifications