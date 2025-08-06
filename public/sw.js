// Service Worker para notificações push
const CACHE_NAME = 'fhd-automacao-v1'
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css'
]

// Instalar Service Worker
self.addEventListener('install', (event) => {
  console.log('📱 Service Worker instalado')
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache)
      })
  )
})

// Ativar Service Worker
self.addEventListener('activate', (event) => {
  console.log('🔥 Service Worker ativado')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

// Interceptar requisições para cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - retorna resposta
        if (response) {
          return response
        }
        return fetch(event.request)
      })
  )
})

// 🔔 NOTIFICAÇÕES PUSH
self.addEventListener('push', (event) => {
  console.log('📨 Notificação push recebida:', event)
  
  let options = {
    body: 'Você tem atualizações importantes!',
    icon: '/logo.png',
    badge: '/logo.png',
    vibrate: [200, 100, 200],
    data: {
      url: '/admin-fhd'
    },
    actions: [
      {
        action: 'open',
        title: 'Ver Detalhes',
        icon: '/logo.png'
      },
      {
        action: 'close',
        title: 'Fechar'
      }
    ],
    requireInteraction: true,
    tag: 'fhd-notification'
  }

  if (event.data) {
    const data = event.data.json()
    options = {
      ...options,
      ...data
    }
  }

  event.waitUntil(
    self.registration.showNotification('FHD Automação', options)
  )
})

// Clique na notificação
self.addEventListener('notificationclick', (event) => {
  console.log('🖱️ Clique na notificação:', event)
  
  event.notification.close()

  if (event.action === 'close') {
    return
  }

  // Abrir ou focar na aba do app
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then((clientList) => {
      const url = event.notification.data?.url || '/admin-fhd'
      
      // Verificar se já existe uma aba aberta
      for (const client of clientList) {
        if (client.url.includes('admin-fhd') && 'focus' in client) {
          return client.focus()
        }
      }
      
      // Abrir nova aba
      if (clients.openWindow) {
        return clients.openWindow(url)
      }
    })
  )
})

// Fechar notificação
self.addEventListener('notificationclose', (event) => {
  console.log('❌ Notificação fechada:', event)
})