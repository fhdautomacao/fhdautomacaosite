// Service Worker para notificações push
const CACHE_NAME = 'fhd-automacao-v2' // Versão atualizada para forçar limpeza

// Instalar Service Worker
self.addEventListener('install', (event) => {
  console.log('📱 Service Worker instalado - versão v2')
  
  // Forçar ativação imediata
  self.skipWaiting()
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('✅ Cache aberto:', CACHE_NAME)
        return Promise.resolve()
      })
      .catch((error) => {
        console.error('❌ Erro ao abrir cache:', error)
      })
  )
})

// Ativar Service Worker
self.addEventListener('activate', (event) => {
  console.log('🔥 Service Worker ativado - versão v2')
  
  // Forçar controle imediato
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('🗑️ Removendo cache antigo:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
    ])
  )
})

// Interceptar requisições para cache (APENAS para páginas, não assets)
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  
  // NÃO interceptar assets (JS, CSS, imagens, etc.)
  if (url.pathname.includes('/assets/') || 
      url.pathname.includes('.js') || 
      url.pathname.includes('.css') ||
      url.pathname.includes('.png') ||
      url.pathname.includes('.jpg') ||
      url.pathname.includes('.ico') ||
      url.pathname.includes('.svg') ||
      url.pathname.includes('.woff') ||
      url.pathname.includes('.woff2') ||
      url.pathname.includes('.ttf')) {
    // Deixar passar direto para a rede
    return
  }
  
  // Apenas para páginas HTML
  if (request.method === 'GET' && request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Só fazer cache se a resposta for válida
          if (response && response.status === 200) {
            const responseClone = response.clone()
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseClone)
              })
              .catch((error) => {
                console.error('❌ Erro ao fazer cache:', error)
              })
          }
          return response
        })
        .catch((error) => {
          console.error('❌ Erro na requisição:', error)
          // Em caso de erro, tentar buscar do cache
          return caches.match(request)
        })
    )
  }
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
    try {
      const data = event.data.json()
      options = {
        ...options,
        ...data
      }
    } catch (error) {
      console.error('❌ Erro ao processar dados da notificação:', error)
    }
  }

  event.waitUntil(
    self.registration.showNotification('FHD Automação', options)
      .catch((error) => {
        console.error('❌ Erro ao mostrar notificação:', error)
      })
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
    }).catch((error) => {
      console.error('❌ Erro ao abrir janela:', error)
    })
  )
})

// Fechar notificação
self.addEventListener('notificationclose', (event) => {
  console.log('❌ Notificação fechada:', event)
})