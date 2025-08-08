// Sistema de Segurança Avançado
import { supabase } from './supabase'

class SecurityManager {
  constructor() {
    this.maxLoginAttempts = 5
    this.lockoutDuration = 15 * 60 * 1000 // 15 minutos
    this.sessionTimeout = 24 * 60 * 60 * 1000 // 24 horas
    this.rateLimitWindow = 60 * 1000 // 1 minuto
    this.maxRequestsPerWindow = 10
  }

  // Gerenciamento de Sessões
  async registerSession(userId, sessionId) {
    try {
      // Deletar sessões existentes para evitar duplicatas
      await supabase
        .from('active_sessions')
        .delete()
        .eq('user_id', userId)

      const { error } = await supabase
        .from('active_sessions')
        .insert({
          user_id: userId,
          session_id: sessionId,
          created_at: new Date().toISOString(),
          last_activity: new Date().toISOString(),
          user_agent: navigator.userAgent,
          ip_address: await this.getClientIP()
        })

      if (error) throw error
    } catch (error) {
      console.error('Erro ao registrar sessão:', error)
    }
  }

  async updateSessionActivity(sessionId) {
    try {
      const { error } = await supabase
        .from('active_sessions')
        .update({
          last_activity: new Date().toISOString()
        })
        .eq('session_id', sessionId)

      if (error) throw error
    } catch (error) {
      console.error('Erro ao atualizar atividade da sessão:', error)
    }
  }

  async endSession(sessionId) {
    try {
      const { error } = await supabase
        .from('active_sessions')
        .delete()
        .eq('session_id', sessionId)

      if (error) throw error
    } catch (error) {
      console.error('Erro ao encerrar sessão:', error)
    }
  }

  async getActiveSessions(userId) {
    try {
      const { data, error } = await supabase
        .from('active_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('last_activity', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erro ao buscar sessões ativas:', error)
      return []
    }
  }

  // Detecção de Múltiplas Sessões
  async detectMultipleSessions(userId) {
    try {
      const sessions = await this.getActiveSessions(userId)
      
      if (sessions.length > 1) {
        await this.logSecurityActivity(userId, 'multiple_sessions_detected', {
          session_count: sessions.length,
          sessions: sessions.map(s => ({
            id: s.session_id,
            created_at: s.created_at,
            ip_address: s.ip_address,
            user_agent: s.user_agent
          }))
        })
        
        return {
          detected: true,
          sessions: sessions
        }
      }

      return { detected: false, sessions: sessions }
    } catch (error) {
      console.error('Erro ao detectar múltiplas sessões:', error)
      return { detected: false, sessions: [] }
    }
  }

  // Rate Limiting
  async checkRateLimit(userId, action = 'general') {
    try {
      const now = new Date()
      const windowStart = new Date(now.getTime() - this.rateLimitWindow)

      const { data, error } = await supabase
        .from('security_logs')
        .select('id')
        .eq('user_id', userId)
        .eq('activity_type', action)
        .gte('created_at', windowStart.toISOString())

      if (error) throw error

      const requestCount = data?.length || 0
      
      if (requestCount >= this.maxRequestsPerWindow) {
        await this.logSecurityActivity(userId, 'rate_limit_exceeded', {
          action,
          request_count: requestCount,
          window_start: windowStart.toISOString()
        })
        
        return false
      }

      // Log da atividade
      await this.logSecurityActivity(userId, action, {
        request_count: requestCount + 1
      })

      return true
    } catch (error) {
      console.error('Erro ao verificar rate limit:', error)
      return true // Permitir em caso de erro
    }
  }

  // Controle de Tentativas de Login
  async recordLoginAttempt(email, success, ipAddress = null) {
    try {
      const { error } = await supabase
        .from('login_attempts')
        .insert({
          email,
          success,
          ip_address: ipAddress || await this.getClientIP(),
          user_agent: navigator.userAgent,
          attempted_at: new Date().toISOString()
        })

      if (error) throw error
    } catch (error) {
      console.error('Erro ao registrar tentativa de login:', error)
    }
  }

  async checkLoginAttempts(email) {
    try {
      const lockoutTime = new Date(Date.now() - this.lockoutDuration)
      
      const { data, error } = await supabase
        .from('login_attempts')
        .select('*')
        .eq('email', email)
        .eq('success', false)
        .gte('attempted_at', lockoutTime.toISOString())
        .order('attempted_at', { ascending: false })

      if (error) throw error

      const failedAttempts = data?.length || 0
      
      if (failedAttempts >= this.maxLoginAttempts) {
        await this.blockUser(email, 'max_login_attempts')
        return {
          blocked: true,
          attempts: failedAttempts,
          nextAttemptAllowed: new Date(Date.now() + this.lockoutDuration)
        }
      }

      return {
        blocked: false,
        attempts: failedAttempts,
        remaining: this.maxLoginAttempts - failedAttempts
      }
    } catch (error) {
      console.error('Erro ao verificar tentativas de login:', error)
      return { blocked: false, attempts: 0, remaining: this.maxLoginAttempts }
    }
  }

  // Bloqueio de Usuários
  async blockUser(email, reason, duration = this.lockoutDuration) {
    try {
      const unblockAt = new Date(Date.now() + duration)
      
      const { error } = await supabase
        .from('user_blocks')
        .insert({
          email,
          reason,
          blocked_at: new Date().toISOString(),
          unblock_at: unblockAt.toISOString(),
          is_active: true
        })

      if (error) throw error

      await this.logSecurityActivity(null, 'user_blocked', {
        email,
        reason,
        duration,
        unblock_at: unblockAt.toISOString()
      })
    } catch (error) {
      console.error('Erro ao bloquear usuário:', error)
    }
  }

  async isUserBlocked(email) {
    try {
      const { data, error } = await supabase
        .from('user_blocks')
        .select('*')
        .eq('email', email)
        .eq('is_active', true)
        .gt('unblock_at', new Date().toISOString())
        .order('blocked_at', { ascending: false })
        .limit(1)

      if (error) throw error

      return data && data.length > 0 ? data[0] : null
    } catch (error) {
      console.error('Erro ao verificar bloqueio de usuário:', error)
      return null
    }
  }

  async unblockUser(email) {
    try {
      const { error } = await supabase
        .from('user_blocks')
        .update({ is_active: false })
        .eq('email', email)
        .eq('is_active', true)

      if (error) throw error

      await this.logSecurityActivity(null, 'user_unblocked', { email })
    } catch (error) {
      console.error('Erro ao desbloquear usuário:', error)
    }
  }

  // Log de Atividades de Segurança
  async logSecurityActivity(userId, activityType, details = {}) {
    try {
      const { error } = await supabase
        .from('security_logs')
        .insert({
          user_id: userId,
          activity_type: activityType,
          details: details,
          ip_address: await this.getClientIP(),
          user_agent: navigator.userAgent,
          created_at: new Date().toISOString()
        })

      if (error) throw error
    } catch (error) {
      console.error('Erro ao registrar atividade de segurança:', error)
    }
  }

  async getSecurityLogs(userId = null, limit = 100) {
    try {
      let query = supabase
        .from('security_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (userId) {
        query = query.eq('user_id', userId)
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erro ao buscar logs de segurança:', error)
      return []
    }
  }

  // Dispositivos Confiáveis
  async addTrustedDevice(userId, deviceInfo) {
    try {
      const deviceFingerprint = await this.generateDeviceFingerprint()
      
      const { error } = await supabase
        .from('trusted_devices')
        .insert({
          user_id: userId,
          device_fingerprint: deviceFingerprint,
          device_info: deviceInfo,
          trusted_at: new Date().toISOString(),
          last_used: new Date().toISOString(),
          is_active: true
        })

      if (error) throw error

      await this.logSecurityActivity(userId, 'trusted_device_added', {
        device_fingerprint: deviceFingerprint,
        device_info: deviceInfo
      })

      return deviceFingerprint
    } catch (error) {
      console.error('Erro ao adicionar dispositivo confiável:', error)
      return null
    }
  }

  async isTrustedDevice(userId) {
    try {
      const deviceFingerprint = await this.generateDeviceFingerprint()
      
      const { data, error } = await supabase
        .from('trusted_devices')
        .select('*')
        .eq('user_id', userId)
        .eq('device_fingerprint', deviceFingerprint)
        .eq('is_active', true)
        .limit(1)

      if (error) throw error

      if (data && data.length > 0) {
        // Atualizar último uso
        await supabase
          .from('trusted_devices')
          .update({ last_used: new Date().toISOString() })
          .eq('id', data[0].id)

        return true
      }

      return false
    } catch (error) {
      console.error('Erro ao verificar dispositivo confiável:', error)
      return false
    }
  }

  // Utilitários
  async getClientIP() {
    try {
      const response = await fetch('https://api.ipify.org?format=json')
      const data = await response.json()
      return data.ip
    } catch (error) {
      console.error('Erro ao obter IP:', error)
      return 'unknown'
    }
  }

  async generateDeviceFingerprint() {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    ctx.textBaseline = 'top'
    ctx.font = '14px Arial'
    ctx.fillText('Device fingerprint', 2, 2)

    const fingerprint = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screen: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      canvas: canvas.toDataURL()
    }

    return btoa(JSON.stringify(fingerprint)).substring(0, 64)
  }

  // Limpeza de Dados Antigos
  async cleanupOldData() {
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      
      // Limpar sessões antigas
      await supabase
        .from('active_sessions')
        .delete()
        .lt('last_activity', thirtyDaysAgo.toISOString())

      // Limpar logs antigos
      await supabase
        .from('security_logs')
        .delete()
        .lt('created_at', thirtyDaysAgo.toISOString())

      // Limpar tentativas de login antigas
      await supabase
        .from('login_attempts')
        .delete()
        .lt('attempted_at', thirtyDaysAgo.toISOString())

      console.log('Limpeza de dados antigos concluída')
    } catch (error) {
      console.error('Erro na limpeza de dados antigos:', error)
    }
  }
}

// Instância global do gerenciador de segurança
const securityManager = new SecurityManager()

// Função de inicialização
export const initializeSecurity = () => {
  // Configurar limpeza automática (executar uma vez por dia)
  setInterval(() => {
    securityManager.cleanupOldData()
  }, 24 * 60 * 60 * 1000)

  console.log('Sistema de segurança inicializado')
}

export default securityManager