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

  // Gerar chave VAPID (para produção, usar chave real do servidor)
  getVapidKey() {
    // Esta é uma chave de exemplo - em produção, use uma chave real do seu servidor
    return 'BCgaW_7BT4LSeAZjzE6Q1VAE8FU9zGF8v6ZT7qBhKbKa7HNmqwA5xYd1qjUn3k4hxO9Z2K9L2MZNQ6VvQbAH8wE'
  }

  // Criar subscription
  async createSubscription() {
    if (!this.registration) {
      await this.registerServiceWorker()
    }

    try {
      this.subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.getVapidKey())
      })

      console.log('✅ Subscription criada:', this.subscription)
      
      // Salvar subscription no localStorage para persistência
      localStorage.setItem('pushSubscription', JSON.stringify(this.subscription))
      
      return this.subscription
    } catch (error) {
      console.error('❌ Erro ao criar subscription:', error)
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
      } catch {
        localStorage.removeItem('pushSubscription')
      }
    }

    if (!this.registration) {
      await this.registerServiceWorker()
    }

    const existingSubscription = await this.registration.pushManager.getSubscription()
    if (existingSubscription) {
      this.subscription = existingSubscription
      localStorage.setItem('pushSubscription', JSON.stringify(existingSubscription))
    }

    return this.subscription
  }

  // Cancelar subscription
  async unsubscribe() {
    const subscription = await this.getSubscription()
    if (subscription) {
      await subscription.unsubscribe()
      localStorage.removeItem('pushSubscription')
      this.subscription = null
      console.log('🔕 Subscription cancelada')
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

  // Utility: Converter chave VAPID
  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
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