import { useCallback, useEffect, useState } from 'react'
import { useJWTAuth } from '@/contexts/JWTAuthContext'
import { supabase } from '@/lib/supabase'

export const useAuthenticatedSupabase = () => {
  const { isAuthenticated } = useJWTAuth()
  const [isSupabaseAuthenticated, setIsSupabaseAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // Verificar se o Supabase está autenticado
  const checkSupabaseAuth = useCallback(async () => {
    try {
      setLoading(true)
      
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) {
        console.error('❌ Erro ao verificar autenticação Supabase:', error)
        setIsSupabaseAuthenticated(false)
        return false
      }
      
      const isAuth = !!user
      setIsSupabaseAuthenticated(isAuth)
      
      if (isAuth) {
        console.log('✅ Supabase autenticado:', user.email)
      } else {
        console.log('⚠️ Supabase não autenticado')
      }
      
      return isAuth
    } catch (error) {
      console.error('❌ Erro ao verificar autenticação Supabase:', error)
      setIsSupabaseAuthenticated(false)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  // Verificar autenticação na inicialização
  useEffect(() => {
    if (isAuthenticated) {
      checkSupabaseAuth()
    } else {
      setIsSupabaseAuthenticated(false)
      setLoading(false)
    }
  }, [isAuthenticated, checkSupabaseAuth])

  // Função para fazer operações autenticadas
  const authenticatedOperation = useCallback(async (operation) => {
    if (!isAuthenticated) {
      throw new Error('Usuário não autenticado no sistema')
    }

    if (!isSupabaseAuthenticated) {
      throw new Error('Usuário não autenticado no banco de dados. Faça login novamente.')
    }

    try {
      return await operation(supabase)
    } catch (error) {
      console.error('❌ Erro na operação autenticada:', error)
      
      // Se for erro de autenticação, tentar renovar sessão
      if (error.message?.includes('JWT') || error.message?.includes('authentication')) {
        console.log('🔄 Tentando renovar sessão Supabase...')
        const { data, error: refreshError } = await supabase.auth.refreshSession()
        
        if (refreshError || !data.session) {
          throw new Error('Sessão expirada. Faça login novamente.')
        }
        
        // Tentar operação novamente
        return await operation(supabase)
      }
      
      throw error
    }
  }, [isAuthenticated, isSupabaseAuthenticated])

  // Função para verificar se pode fazer operações
  const canPerformOperations = useCallback(() => {
    return isAuthenticated && isSupabaseAuthenticated && !loading
  }, [isAuthenticated, isSupabaseAuthenticated, loading])

  return {
    supabase,
    isAuthenticated: isSupabaseAuthenticated,
    loading,
    authenticatedOperation,
    canPerformOperations,
    checkSupabaseAuth
  }
} 