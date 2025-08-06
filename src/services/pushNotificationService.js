// Serviço de notificações push
class PushNotificationService {
  constructor() {
    this.isSupported = 'serviceWorker' in navigator && 'PushManager' in window
    this.registration = null
    this.subscription = null
  }

  // Verificar se notificações são suportadas
  isNotificationSupported() {
    return this.isSupported && 'Notification' in window
  }

  // Registrar Service Worker
  async registerServiceWorker() {
    if (!this.isSupported) {
      throw new Error('Service Workers não são suportados neste navegador')
    }

    try {
      // Verificar se já existe um Service Worker registrado
      const existingRegistration = await navigator.serviceWorker.getRegistration()
      if (existingRegistration) {
        console.log('🔄 Service Worker já registrado:', existingRegistration)
        this.registration = existingRegistration
        return existingRegistration
      }

      // Aguardar um pouco antes de registrar para evitar conflitos
      await new Promise(resolve => setTimeout(resolve, 100))

      // Registrar novo Service Worker
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none' // Sempre buscar versão mais recente
      })
      
      console.log('✅ Service Worker registrado:', this.registration)
      
      // Aguardar o Service Worker estar pronto
      await navigator.serviceWorker.ready
      console.log('✅ Service Worker pronto para uso')
      
      return this.registration
    } catch (error) {
      console.error('❌ Erro ao registrar Service Worker:', error)
      
      // Se falhar, tentar desregistrar e registrar novamente
      try {
        const registrations = await navigator.serviceWorker.getRegistrations()
        for (const registration of registrations) {
          await registration.unregister()
        }
        console.log('🔄 Service Workers antigos removidos')
        
        // Aguardar um pouco antes de registrar novamente
        await new Promise(resolve => setTimeout(resolve, 200))
        
        // Tentar registrar novamente
        this.registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
          updateViaCache: 'none'
        })
        console.log('✅ Service Worker re-registrado:', this.registration)
        return this.registration
      } catch (retryError) {
        console.error('❌ Erro ao re-registrar Service Worker:', retryError)
        throw retryError
      }
    }
  }

  // Solicitar permissão para notificações
  async requestPermission() {
    if (!this.isNotificationSupported()) {
      throw new Error('Notificações não são suportadas neste navegador')
    }

    const permission = await Notification.requestPermission()
    console.log('🔔 Permissão de notificação:', permission)
    
    return permission === 'granted'
  }

  // Verificar status da permissão
  getPermissionStatus() {
    if (!this.isNotificationSupported()) {
      return 'unsupported'
    }
    
    return Notification.permission
  }

  // Criar subscription (usando notificações locais por enquanto)
  async createSubscription() {
    if (!this.registration) {
      await this.registerServiceWorker()
    }

    try {
      // Por enquanto, vamos usar apenas notificações locais sem push server
      // Criar uma subscription "mock" para compatibilidade
      this.subscription = {
        endpoint: 'local-notifications',
        type: 'local',
        created: new Date().toISOString()
      }

      console.log('✅ Sistema de notificações locais ativado:', this.subscription)
      
      // Salvar subscription no localStorage para persistência
      localStorage.setItem('pushSubscription', JSON.stringify(this.subscription))
      
      return this.subscription
    } catch (error) {
      console.error('❌ Erro ao configurar notificações:', error)
      throw error
    }
  }

  // Recuperar subscription existente
  async getSubscription() {
    // Tentar recuperar do localStorage primeiro
    const savedSubscription = localStorage.getItem('pushSubscription')
    if (savedSubscription) {
      try {
        this.subscription = JSON.parse(savedSubscription)
        return this.subscription
      } catch {
        localStorage.removeItem('pushSubscription')
      }
    }

    return this.subscription
  }

  // Cancelar subscription
  async unsubscribe() {
    const subscription = await this.getSubscription()
    if (subscription) {
      // Para notificações locais, apenas limpar o localStorage
      localStorage.removeItem('pushSubscription')
      this.subscription = null
      console.log('🔕 Notificações desativadas')
    }
  }

  // Detectar se é mobile
  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }

  // Limpar cache e atualizar
  async clearCacheAndUpdate() {
    if (!this.isSupported) {
      console.warn('⚠️ Service Workers não são suportados')
      return false
    }

    try {
      console.log('🧹 Limpando cache e atualizando...')
      
      // 1. Desregistrar todos os Service Workers
      const registrations = await navigator.serviceWorker.getRegistrations()
      for (const registration of registrations) {
        await registration.unregister()
        console.log('🗑️ Service Worker desregistrado:', registration)
      }
      
      // 2. Limpar todos os caches
      const cacheNames = await caches.keys()
      for (const cacheName of cacheNames) {
        await caches.delete(cacheName)
        console.log('🗑️ Cache removido:', cacheName)
      }
      
      // 3. Aguardar um pouco
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 4. Registrar novo Service Worker
      await this.registerServiceWorker()
      
      // 5. Forçar atualização da página após um delay
      setTimeout(() => {
        console.log('🔄 Forçando atualização da página...')
        window.location.reload()
      }, 1000)
      
      console.log('✅ Cache limpo e Service Worker atualizado')
      return true
    } catch (error) {
      console.error('❌ Erro ao limpar cache:', error)
      return false
    }
  }

  // Enviar notificação local (teste)
  async sendLocalNotification(title, options = {}) {
    try {
      // Verificar permissão
      if (this.getPermissionStatus() !== 'granted') {
        throw new Error('Permissão de notificação não concedida')
      }

      // Verificar se Notification está disponível
      if (!('Notification' in window)) {
        throw new Error('Notificações não são suportadas neste navegador')
      }

      const isMobileDevice = this.isMobile()
      
      const defaultOptions = {
        body: options.body || 'Notificação de teste do sistema FHD',
        icon: '/logo.png',
        badge: '/logo.png',
        data: {
          url: '/admin-fhd'
        },
        // Vibração mais suave para mobile
        vibrate: isMobileDevice ? [100, 50, 100] : [200, 100, 200],
        // Para mobile, usar configurações mais conservadoras
        requireInteraction: !isMobileDevice,
        silent: false
      }

      // Combinar opções
      const finalOptions = { ...defaultOptions, ...options }
      
      console.log('🔔 Enviando notificação:', { title, finalOptions, isMobileDevice })

      const notification = new Notification(title, finalOptions)
      
      // Event handlers
      notification.onclick = () => {
        console.log('🖱️ Notificação clicada')
        if ('focus' in window) {
          window.focus()
        }
        notification.close()
        
        // Navegar se especificado
        if (finalOptions.data?.url) {
          if (isMobileDevice) {
            // Para mobile, usar window.open para garantir funcionamento
            window.open(finalOptions.data.url, '_self')
          } else {
            window.location.href = finalOptions.data.url
          }
        }
      }

      notification.onerror = (error) => {
        console.error('❌ Erro na notificação:', error)
      }

      notification.onshow = () => {
        console.log('✅ Notificação exibida com sucesso')
      }

      notification.onclose = () => {
        console.log('❌ Notificação fechada')
      }

      // Auto-close após 5 segundos no mobile para evitar acúmulo
      if (isMobileDevice) {
        setTimeout(() => {
          notification.close()
        }, 5000)
      }

      return notification
      
    } catch (error) {
      console.error('❌ Erro ao enviar notificação local:', error)
      
      // Lançar erro mais específico baseado no problema
      if (error.message.includes('permission')) {
        throw new Error('Permissão de notificação negada. Permita notificações nas configurações do navegador.')
      } else if (error.message.includes('supported')) {
        throw new Error('Notificações não são suportadas neste navegador.')
      } else {
        throw new Error(`Erro ao exibir notificação: ${error.message}`)
      }
    }
  }

  // Configurar notificações
  async setup() {
    if (!this.isSupported) {
      console.warn('⚠️ Service Workers não são suportados')
      return false
    }

    try {
      // Aguardar um pouco para evitar conflitos durante o carregamento da página
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('🔧 Configurando notificações...')
      
      // Registrar Service Worker
      await this.registerServiceWorker()
      
      // Verificar permissão
      const permission = this.getPermissionStatus()
      console.log('🔔 Status da permissão:', permission)
      
      if (permission === 'default') {
        // Solicitar permissão
        const granted = await this.requestPermission()
        if (!granted) {
          console.warn('⚠️ Permissão de notificação negada')
          return false
        }
      } else if (permission === 'denied') {
        console.warn('⚠️ Permissão de notificação negada anteriormente')
        return false
      }
      
      // Criar subscription
      await this.createSubscription()
      
      console.log('✅ Notificações configuradas com sucesso')
      return true
    } catch (error) {
      console.error('❌ Erro ao configurar notificações:', error)
      return false
    }
  }



  // Verificar se já está configurado
  async isConfigured() {
    const permission = this.getPermissionStatus()
    const subscription = await this.getSubscription()
    
    return permission === 'granted' && subscription !== null
  }

  // Obter informações de status
  async getStatus() {
    const subscription = await this.getSubscription()
    
    return {
      supported: this.isNotificationSupported(),
      permission: this.getPermissionStatus(),
      hasSubscription: subscription !== null,
      configured: await this.isConfigured()
    }
  }
}

// Instância singleton
const pushNotificationService = new PushNotificationService()

export default pushNotificationService