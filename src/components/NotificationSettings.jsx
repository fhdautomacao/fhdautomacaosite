import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bell, BellOff, Smartphone, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import pushNotificationService from '@/services/pushNotificationService'

const NotificationSettings = () => {
  const [status, setStatus] = useState({
    supported: false,
    permission: 'default',
    hasSubscription: false,
    configured: false
  })
  const [loading, setLoading] = useState(true)
  const [enabling, setEnabling] = useState(false)

  useEffect(() => {
    loadStatus()
  }, [])

  const loadStatus = async () => {
    try {
      setLoading(true)
      const currentStatus = await pushNotificationService.getStatus()
      setStatus(currentStatus)
    } catch (error) {
      console.error('Erro ao carregar status:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEnableNotifications = async () => {
    try {
      setEnabling(true)
      const success = await pushNotificationService.setup()
      
      if (success) {
        await loadStatus()
        
        // Enviar notificação de teste
        setTimeout(() => {
          pushNotificationService.sendLocalNotification(
            '🎉 Notificações Ativadas!',
            {
              body: 'Você receberá alertas importantes sobre boletos vencidos e orçamentos.',
              icon: '/logo.png',
              vibrate: [200, 100, 200, 100, 200]
            }
          )
        }, 1000)
      }
    } catch (error) {
      console.error('Erro ao ativar notificações:', error)
      alert('Erro ao ativar notificações. Verifique as permissões do navegador.')
    } finally {
      setEnabling(false)
    }
  }

  const handleDisableNotifications = async () => {
    try {
      await pushNotificationService.unsubscribe()
      await loadStatus()
    } catch (error) {
      console.error('Erro ao desativar notificações:', error)
    }
  }

  const handleTestNotification = async () => {
    try {
      await pushNotificationService.sendLocalNotification(
        '🧪 Teste de Notificação',
        {
          body: 'Esta é uma notificação de teste para verificar se está funcionando!',
          icon: '/logo.png',
          vibrate: [100, 50, 100, 50, 100]
        }
      )
    } catch (error) {
      console.error('Erro ao enviar notificação de teste:', error)
      alert('Erro ao enviar notificação de teste.')
    }
  }

  const getStatusColor = () => {
    if (!status.supported) return 'bg-gray-100 text-gray-800'
    if (status.configured) return 'bg-green-100 text-green-800'
    if (status.permission === 'denied') return 'bg-red-100 text-red-800'
    return 'bg-yellow-100 text-yellow-800'
  }

  const getStatusText = () => {
    if (!status.supported) return 'Não Suportado'
    if (status.configured) return 'Ativadas'
    if (status.permission === 'denied') return 'Bloqueadas'
    return 'Desativadas'
  }

  const getStatusIcon = () => {
    if (!status.supported) return <XCircle className="h-4 w-4" />
    if (status.configured) return <CheckCircle className="h-4 w-4" />
    if (status.permission === 'denied') return <XCircle className="h-4 w-4" />
    return <AlertTriangle className="h-4 w-4" />
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <Bell className="h-5 w-5 animate-pulse" />
            <span>Carregando configurações...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Smartphone className="h-5 w-5" />
            <span>Notificações Push</span>
            <Badge className={getStatusColor()}>
              {getStatusIcon()}
              <span className="ml-1">{getStatusText()}</span>
            </Badge>
          </CardTitle>
          <CardDescription>
            Receba alertas importantes diretamente no seu celular sobre boletos vencidos, orçamentos e atualizações.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Status Detalhado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Status do Sistema</h4>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Suporte do Navegador</span>
                  <Badge variant={status.supported ? "default" : "destructive"}>
                    {status.supported ? "✅ Sim" : "❌ Não"}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Permissão</span>
                  <Badge variant={
                    status.permission === 'granted' ? "default" : 
                    status.permission === 'denied' ? "destructive" : "secondary"
                  }>
                    {status.permission === 'granted' ? "✅ Concedida" : 
                     status.permission === 'denied' ? "❌ Negada" : "⏳ Pendente"}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Subscription</span>
                  <Badge variant={status.hasSubscription ? "default" : "secondary"}>
                    {status.hasSubscription ? "✅ Ativa" : "❌ Inativa"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-sm">O que você receberá</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>🔔 Boletos vencidos</li>
                <li>📝 Novos orçamentos</li>
                <li>💰 Divisões de lucro</li>
                <li>📊 Alertas do dashboard</li>
              </ul>
            </div>
          </div>

          {/* Avisos */}
          {!status.supported && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Seu navegador não suporta notificações push. Tente usar Chrome, Firefox ou Safari mais recentes.
              </AlertDescription>
            </Alert>
          )}

          {status.permission === 'denied' && (
            <Alert>
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                Notificações foram bloqueadas. Para ativar, clique no ícone de cadeado na barra de endereço e permita notificações.
              </AlertDescription>
            </Alert>
          )}

          {/* Controles */}
          <div className="flex flex-col sm:flex-row gap-3">
            {!status.configured ? (
              <Button 
                onClick={handleEnableNotifications}
                disabled={!status.supported || enabling}
                className="flex-1"
              >
                <Bell className="h-4 w-4 mr-2" />
                {enabling ? 'Ativando...' : 'Ativar Notificações'}
              </Button>
            ) : (
              <>
                <Button 
                  variant="outline"
                  onClick={handleTestNotification}
                  className="flex-1"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Testar Notificação
                </Button>
                
                <Button 
                  variant="destructive"
                  onClick={handleDisableNotifications}
                >
                  <BellOff className="h-4 w-4 mr-2" />
                  Desativar
                </Button>
              </>
            )}
          </div>

          {/* Instruções */}
          {status.supported && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-sm text-blue-900 mb-2">💡 Como usar no celular:</h4>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. Abra este site no navegador do celular</li>
                <li>2. Clique em "Ativar Notificações"</li>
                <li>3. Permita notificações quando solicitado</li>
                <li>4. Pronto! Você receberá alertas mesmo com o site fechado</li>
              </ol>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default NotificationSettings