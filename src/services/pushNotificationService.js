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
      this.registration = await navigator.serviceWorker.register('/sw.js')
      console.log('✅ Service Worker registrado:', this.registration)
      return this.registration
    } catch (error) {
      console.error('❌ Erro ao registrar Service Worker:', error)
      throw error
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

  // Enviar notificação local (teste)
  async sendLocalNotification(title, options = {}) {
    if (this.getPermissionStatus() !== 'granted') {
      throw new Error('Permissão de notificação não concedida')
    }

    const defaultOptions = {
      body: 'Notificação de teste',
      icon: '/logo.png',
      badge: '/logo.png',
      vibrate: [200, 100, 200],
      data: {
        url: '/admin-fhd'
      }
    }

    const notification = new Notification(title, { ...defaultOptions, ...options })
    
    notification.onclick = () => {
      window.focus()
      notification.close()
      if (options.data?.url) {
        window.location.href = options.data.url
      }
    }

    return notification
  }

  // Configuração completa de notificações
  async setup() {
    try {
      console.log('🚀 Configurando notificações push...')
      
      // 1. Verificar suporte
      if (!this.isNotificationSupported()) {
        throw new Error('Notificações não são suportadas')
      }

      // 2. Registrar Service Worker
      await this.registerServiceWorker()

      // 3. Solicitar permissão
      const hasPermission = await this.requestPermission()
      if (!hasPermission) {
        throw new Error('Permissão de notificação negada')
      }

      // 4. Criar subscription
      await this.createSubscription()

      console.log('✅ Notificações push configuradas com sucesso!')
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