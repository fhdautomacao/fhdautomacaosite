import { useCallback, useEffect, useState } from 'react'
import { useJWTAuth } from '@/contexts/JWTAuthContext'
import { supabase } from '@/lib/supabase'

export const useAuthenticatedSupabase = () => {
  const { isAuthenticated, token } = useJWTAuth()
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
    if (isAuthenticated && token) {
      checkSupabaseAuth()
    } else {
      setIsSupabaseAuthenticated(false)
      setLoading(false)
    }
  }, [isAuthenticated, token, checkSupabaseAuth])

  // Função para fazer operações autenticadas com verificação automática
  const authenticatedOperation = useCallback(async (operation) => {
    if (!isAuthenticated) {
      throw new Error('Usuário não autenticado no sistema')
    }

    // Verificar autenticação Supabase antes de cada operação
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      console.log('🔄 Usuário não autenticado no Supabase, tentando renovar sessão...')
      
      // Tentar renovar a sessão
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession()
      
      if (refreshError || !refreshData.session) {
        throw new Error('Sessão expirada. Faça login novamente.')
      }
      
      console.log('✅ Sessão Supabase renovada')
    }

    try {
      return await operation(supabase)
    } catch (error) {
      console.error('❌ Erro na operação autenticada:', error)
      
      // Se for erro de autenticação, tentar renovar sessão
      if (error.message?.includes('JWT') || error.message?.includes('authentication') || error.message?.includes('row-level security')) {
        console.log('🔄 Erro de autenticação detectado, tentando renovar sessão...')
        
        try {
          const { data, error: refreshError } = await supabase.auth.refreshSession()
          
          if (refreshError || !data.session) {
            throw new Error('Sessão expirada. Faça login novamente.')
          }
          
          console.log('✅ Sessão renovada, tentando operação novamente...')
          
          // Tentar operação novamente
          return await operation(supabase)
        } catch (refreshError) {
          throw new Error('Falha na renovação da sessão. Faça login novamente.')
        }
      }
      
      throw error
    }
  }, [isAuthenticated])

  // Função para verificar se pode fazer operações
  const canPerformOperations = useCallback(() => {
    return isAuthenticated && !loading
  }, [isAuthenticated, loading])

  return {
    supabase,
    isAuthenticated: isSupabaseAuthenticated,
    loading,
    authenticatedOperation,
    canPerformOperations,
    checkSupabaseAuth
  }
} 