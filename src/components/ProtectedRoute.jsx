import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useJWTAuth } from '@/contexts/JWTAuthContext'
import { toast } from 'sonner'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, logout } = useJWTAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      console.log('🚫 Acesso negado - usuário não autenticado')
      localStorage.setItem('session_expired', 'true')
      logout()
      navigate('/admin/login')
      toast.error('Acesso negado. Faça login para continuar.')
    }
  }, [isAuthenticated, loading, logout, navigate])

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  // Se não estiver autenticado, não renderizar nada (será redirecionado)
  if (!isAuthenticated) {
    return null
  }

  // Se estiver autenticado, renderizar o conteúdo protegido
  return <>{children}</>
}

export default ProtectedRoute
