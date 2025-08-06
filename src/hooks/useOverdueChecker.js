import { useEffect, useRef } from 'react'
import { billsAPI } from '@/api/bills'

/**
 * Hook para verificar e atualizar boletos vencidos automaticamente
 * @param {boolean} enabled - Se o checker deve estar ativo
 * @param {number} intervalMinutes - Intervalo em minutos para verificar (padrão: 60 minutos)
 */
export const useOverdueChecker = (enabled = true, intervalMinutes = 60) => {
  const intervalRef = useRef(null)

  const checkAndUpdateOverdue = async () => {
    try {
      console.log('🔍 Verificando boletos vencidos...')
      const result = await billsAPI.updateOverdueStatus()
      
      if (result.total > 0) {
        console.log(`✅ ${result.total} boleto(s) atualizado(s) para status 'vencido'`)
      } else {
        console.log('ℹ️ Nenhum boleto vencido encontrado')
      }
      
      return result
    } catch (error) {
      console.error('❌ Erro ao verificar boletos vencidos:', error)
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