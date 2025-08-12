import React, { useEffect, useState } from 'react'

const FloatingWhatsApp = () => {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    
    // Criar o botão diretamente no DOM
    const createWhatsAppButton = () => {
      // Remover botão existente se houver
      const existingButton = document.getElementById('whatsapp-floating-button')
      if (existingButton) {
        existingButton.remove()
      }
      
      const phone = '5519998652144'
      const message = 'Olá! Vim pelo site e gostaria de um orçamento.'
      const href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
      
      // Criar o elemento
      const button = document.createElement('div')
      button.id = 'whatsapp-floating-button'
      button.className = 'whatsapp-floating'
      
      // Aplicar estilos inline
      Object.assign(button.style, {
        position: 'fixed',
        bottom: '2rem',
        right: '1.5rem',
        left: 'auto',
        top: 'auto',
        zIndex: '9999999',
        pointerEvents: 'auto',
        width: 'auto',
        height: 'auto',
        transform: 'none'
      })
      
      // HTML do botão
      button.innerHTML = `
        <a href="${href}" target="_blank" rel="noopener noreferrer" 
           style="display: block; position: relative; z-index: 9999999; pointer-events: auto;">
          <div class="group relative">
            <div class="relative w-[52px] h-[52px] md:w-[60px] md:h-[60px] rounded-full shadow-2xl bg-[#25D366] flex items-center justify-center transition-all duration-300 hover:shadow-3xl pointer-events-auto">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" 
                   class="w-9 h-9 md:w-10 md:h-10 drop-shadow" 
                   style="shape-rendering: geometricPrecision;">
                <g transform="translate(16 16) translate(1 1.2) scale(0.86) translate(-16 -16)">
                  <path fill="#FFFFFF" d="M19.11 17.18c-.27-.14-1.61-.8-1.86-.89c-.25-.09-.43-.14-.62.14c-.18.27-.71.89-.87 1.07c-.16.18-.32.2-.59.07c-.27-.14-1.12-.41-2.13-1.28c-.79-.7-1.32-1.56-1.47-1.83c-.16-.27-.02-.42.12-.56c.12-.12.27-.32.41-.48c.14-.16.18-.27.27-.45c.09-.18.05-.34-.02-.48c-.07-.14-.62-1.49-.85-2.05c-.22-.53-.45-.46-.62-.46c-.16 0-.34-.02-.52-.02s-.48.07-.73.34c-.25.27-.96.94-.96 2.29s.99 2.66 1.13 2.84c.14.18 1.95 2.98 4.72 4.17c.66.29 1.17.46 1.57.59c.66.21 1.26.18 1.74.11c.53-.08 1.61-.66 1.84-1.3c.23-.64.23-1.19.16-1.3c-.07-.11-.23-.18-.5-.32"/>
                </g>
                <path fill="#FFFFFF" d="M16 3C9.383 3 4 8.383 4 15c0 2.103.593 4.066 1.617 5.742L4 29l8.434-1.58C14.05 28.423 15 28.61 16 28.61c6.617 0 12-5.383 12-12S22.617 3 16 3m0 22.61c-.84 0-1.66-.14-2.42-.41l-.52-.19l-4.99.93l.95-4.88l-.2-.5C7.25 19.3 7 17.98 7 16.61C7 11.88 10.88 8 15.61 8S24.22 11.88 24.22 16.61S20.34 25.61 16 25.61"/>
              </svg>
            </div>
          </div>
        </a>
      `
      
      // Adicionar ao body
      document.body.appendChild(button)
      
      console.log('🔧 WhatsApp Button Created:', {
        element: button,
        styles: button.style,
        position: button.style.position,
        bottom: button.style.bottom,
        right: button.style.right
      })
      
      return button
    }
    
    // Criar o botão
    const button = createWhatsAppButton()
    
    // Cleanup
    return () => {
      if (button && button.parentNode) {
        button.parentNode.removeChild(button)
      }
    }
  }, [])
  
  // Não renderizar nada no React, o botão é criado diretamente no DOM
  return null
}

export default FloatingWhatsApp


