import React, { useState, useEffect } from 'react'
import { useJWTAuth } from '../../contexts/JWTAuthContext'
import securityManager from '../../lib/securityConfig'
import { Card } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'

const SecuritySettings = () => {
  const { user } = useJWTAuth()
  const [securityLogs, setSecurityLogs] = useState([])
  const [activeSessions, setActiveSessions] = useState([])
  const [blockedUsers, setBlockedUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalLogs: 0,
    activeSessions: 0,
    blockedUsers: 0,
    loginAttempts: 0
  })

  useEffect(() => {
    if (user) {
      loadSecurityData()
    }
  }, [user])

  const loadSecurityData = async () => {
    try {
      setLoading(true)
      
      // Carregar logs de segurança
      const logs = await securityManager.getSecurityLogs(null, 50)
      setSecurityLogs(logs)

      // Carregar sessões ativas
      const sessions = await securityManager.getActiveSessions(user.id)
      setActiveSessions(sessions)

      // Estatísticas gerais
      setStats({
        totalLogs: logs.length,
        activeSessions: sessions.length,
        blockedUsers: 0, // Implementar depois
        loginAttempts: logs.filter(log => log.activity_type === 'login_attempt').length
      })

    } catch (error) {
      console.error('Erro ao carregar dados de segurança:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEndSession = async (sessionId) => {
    try {
      await securityManager.endSession(sessionId)
      loadSecurityData()
    } catch (error) {
      console.error('Erro ao encerrar sessão:', error)
    }
  }

  const getActivityTypeColor = (type) => {
    const colors = {
      'login_attempt': 'bg-blue-100 text-blue-800',
      'logout': 'bg-gray-100 text-gray-800',
      'password_change': 'bg-green-100 text-green-800',
      'mfa_enabled': 'bg-purple-100 text-purple-800',
      'rate_limit_exceeded': 'bg-red-100 text-red-800',
      'multiple_sessions_detected': 'bg-orange-100 text-orange-800',
      'user_blocked': 'bg-red-100 text-red-800',
      'trusted_device_added': 'bg-green-100 text-green-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR')
  }

  if (!user) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Configurações de Segurança</h1>
        <p>Você precisa estar logado para acessar esta página.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Configurações de Segurança</h1>
        <p>Carregando dados de segurança...</p>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Painel de Segurança</h1>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{stats.totalLogs}</div>
            <div className="text-sm text-gray-500">Logs de Segurança</div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{stats.activeSessions}</div>
            <div className="text-sm text-gray-500">Sessões Ativas</div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">{stats.blockedUsers}</div>
            <div className="text-sm text-gray-500">Usuários Bloqueados</div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">{stats.loginAttempts}</div>
            <div className="text-sm text-gray-500">Tentativas de Login</div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sessões Ativas */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Sessões Ativas</h2>
          <div className="space-y-4">
            {activeSessions.length > 0 ? (
              activeSessions.map((session) => (
                <div key={session.session_id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        ID: {session.session_id.substring(0, 8)}...
                      </div>
                      <div className="text-xs text-gray-500">
                        IP: {session.ip_address}
                      </div>
                      <div className="text-xs text-gray-500">
                        Criada: {formatDateTime(session.created_at)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Última atividade: {formatDateTime(session.last_activity)}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleEndSession(session.session_id)}
                    >
                      Encerrar
                    </Button>
                  </div>
                  <div className="text-xs text-gray-400 truncate">
                    {session.user_agent}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Nenhuma sessão ativa encontrada</p>
            )}
          </div>
        </Card>

        {/* Logs de Segurança */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Logs de Segurança Recentes</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {securityLogs.length > 0 ? (
              securityLogs.map((log) => (
                <div key={log.id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <Badge className={getActivityTypeColor(log.activity_type)}>
                      {log.activity_type}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {formatDateTime(log.created_at)}
                    </span>
                  </div>
                  
                  <div className="text-sm space-y-1">
                    {log.user_id && (
                      <div className="text-xs text-gray-600">
                        Usuário: {log.user_id.substring(0, 8)}...
                      </div>
                    )}
                    
                    {log.ip_address && (
                      <div className="text-xs text-gray-600">
                        IP: {log.ip_address}
                      </div>
                    )}
                    
                    {log.details && Object.keys(log.details).length > 0 && (
                      <details className="text-xs">
                        <summary className="cursor-pointer text-blue-600">
                          Ver detalhes
                        </summary>
                        <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-x-auto">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Nenhum log de segurança encontrado</p>
            )}
          </div>
        </Card>
      </div>

      {/* Ações de Segurança */}
      <Card className="p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">Ações de Segurança</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={loadSecurityData}
            className="w-full"
          >
            Atualizar Dados
          </Button>
          
          <Button
            onClick={() => securityManager.cleanupOldData()}
            variant="outline"
            className="w-full"
          >
            Limpar Dados Antigos
          </Button>
          
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="w-full"
          >
            Recarregar Página
          </Button>
        </div>
      </Card>

      {/* Informações de Segurança */}
      <Card className="p-6 mt-8 bg-blue-50">
        <h3 className="text-lg font-semibold mb-3 text-blue-800">
          Sobre o Sistema de Segurança
        </h3>
        <div className="text-sm text-blue-700 space-y-2">
          <p>• <strong>Logs de Segurança:</strong> Registram todas as atividades importantes do sistema</p>
          <p>• <strong>Sessões Ativas:</strong> Monitoram todos os logins ativos no sistema</p>
          <p>• <strong>Rate Limiting:</strong> Protegem contra ataques de força bruta</p>
          <p>• <strong>Detecção de Múltiplas Sessões:</strong> Alertam sobre logins simultâneos suspeitos</p>
          <p>• <strong>Bloqueio Automático:</strong> Bloqueiam usuários após muitas tentativas de login falhadas</p>
          <p>• <strong>Dispositivos Confiáveis:</strong> Permitem acesso mais rápido de dispositivos conhecidos</p>
        </div>
      </Card>
    </div>
  )
}

export default SecuritySettings