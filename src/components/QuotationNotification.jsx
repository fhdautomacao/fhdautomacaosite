import { useState, useEffect } from 'react'
import { Bell, X, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { quotationsAPI } from '@/api/quotations'

const QuotationNotification = ({ variant = 'floating' }) => {
  const [pendingCount, setPendingCount] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const loadPendingCount = async () => {
      try {
        const stats = await quotationsAPI.getCountByStatus()
        setPendingCount(stats.pending)
      } catch (error) {
        console.error('Erro ao carregar contagem de orçamentos:', error)
      }
    }

    loadPendingCount()
    
    // Atualizar a cada 30 segundos
    const interval = setInterval(loadPendingCount, 30000)
    
    return () => clearInterval(interval)
  }, [])

  if (!isVisible || pendingCount === 0) {
    return null
  }

  // Banner version for admin page
  if (variant === 'banner') {
    return (
      <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-red-100 p-2 rounded-full">
              <Bell className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-sm font-semibold text-gray-900">
                  Novos Orçamentos Pendentes
                </h4>
                <Badge variant="destructive" className="text-xs">
                  {pendingCount}
                </Badge>
              </div>
              <p className="text-xs text-gray-600">
                Você tem {pendingCount} solicitação{pendingCount > 1 ? 'ões' : ''} de orçamento pendente{pendingCount > 1 ? 's' : ''}.
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              className="text-xs"
              onClick={() => window.location.href = '/admin-fhd'}
            >
              <FileText className="w-3 h-3 mr-1" />
              Ver Orçamentos
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs"
              onClick={() => setIsVisible(false)}
            >
              Fechar
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Floating notification (default)
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <Bell className="w-4 h-4 text-red-600" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="text-sm font-semibold text-gray-900">
                  Novos Orçamentos
                </h4>
                <Badge variant="destructive" className="text-xs">
                  {pendingCount}
                </Badge>
              </div>
              <p className="text-xs text-gray-600 mb-3">
                Você tem {pendingCount} solicitação{pendingCount > 1 ? 'ões' : ''} de orçamento pendente{pendingCount > 1 ? 's' : ''}.
              </p>
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  className="text-xs"
                  onClick={() => window.location.href = '/admin-fhd'}
                >
                  <FileText className="w-3 h-3 mr-1" />
                  Ver Orçamentos
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => setIsVisible(false)}
                >
                  Fechar
                </Button>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default QuotationNotification 