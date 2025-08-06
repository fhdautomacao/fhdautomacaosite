import { useEffect, useRef } from 'react'
import { billsAPI } from '@/api/bills'
import { profitSharingAPI } from '@/api/profitSharing'
import { useNotifications } from './useNotifications'

/**
 * Hook para verificar e atualizar boletos vencidos automaticamente
 * @param {boolean} enabled - Se o checker deve estar ativo
 * @param {number} intervalMinutes - Intervalo em minutos para verificar (padrão: 60 minutos)
 */
export const useOverdueChecker = (enabled = true, intervalMinutes = 60) => {
  const intervalRef = useRef(null)
  const { notifyOverdueBills, notifyProfitSharing } = useNotifications()

  const checkAndUpdateOverdue = async () => {
    try {
      console.log('🔍 Verificando boletos e pagamentos de sócio vencidos...')
      
      // Verificar boletos vencidos
      const billsResult = await billsAPI.updateOverdueStatus()
      
      if (billsResult.total > 0) {
        console.log(`✅ ${billsResult.total} boleto(s) atualizado(s) para status 'vencido'`)
        
        // Enviar notificação push sobre boletos vencidos
        try {
          await notifyOverdueBills(billsResult.total, billsResult.updatedBills)
        } catch (notificationError) {
          console.warn('⚠️ Erro ao enviar notificação de boletos:', notificationError)
        }
      } else {
        console.log('ℹ️ Nenhum boleto vencido encontrado')
      }

      // Verificar pagamentos de sócio vencidos
      const profitSharingResult = await profitSharingAPI.updateOverdueStatus()
      
      if (profitSharingResult.total > 0) {
        console.log(`✅ ${profitSharingResult.total} pagamento(s) de sócio atualizado(s) para status 'vencido'`)
        
        // Enviar notificação push sobre pagamentos de sócio vencidos
        try {
          await notifyProfitSharing('payment_overdue', {
            count: profitSharingResult.total,
            payments: profitSharingResult.updatedInstallments
          })
        } catch (notificationError) {
          console.warn('⚠️ Erro ao enviar notificação de pagamentos de sócio:', notificationError)
        }
      } else {
        console.log('ℹ️ Nenhum pagamento de sócio vencido encontrado')
      }
      
      return {
        bills: billsResult,
        profitSharing: profitSharingResult,
        totalUpdated: billsResult.total + profitSharingResult.total
      }
    } catch (error) {
      console.error('❌ Erro ao verificar vencimentos:', error)
      return null
    }
  }

  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    // Executar verificação imediatamente
    checkAndUpdateOverdue()

    // Configurar verificação periódica
    const intervalMs = intervalMinutes * 60 * 1000
    intervalRef.current = setInterval(checkAndUpdateOverdue, intervalMs)

    console.log(`🕐 Sistema de verificação de vencidos ativado (${intervalMinutes} min)`)

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [enabled, intervalMinutes])

  // Função para executar verificação manual
  const forceCheck = () => {
    return checkAndUpdateOverdue()
  }

  return { forceCheck }
}

export default useOverdueChecker