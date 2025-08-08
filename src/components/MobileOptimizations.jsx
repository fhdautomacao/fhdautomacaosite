import { useEffect } from 'react'

/**
 * Componente para otimizações mobile
 * - Melhora viewport
 * - Otimiza touch
 * - Previne zoom indesejado
 */
const MobileOptimizations = () => {
  useEffect(() => {
    // Configurar viewport meta tag dinamicamente se necessário
    const viewport = document.querySelector('meta[name="viewport"]')
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover')
    }

    // Adicionar classes CSS para melhorar performance touch
    const style = document.createElement('style')
    style.textContent = `
      /* Melhorar scroll no iOS */
      .scroll-smooth {
        -webkit-overflow-scrolling: touch;
      }
      
      /* Melhorar toque em botões */
      button, [role="button"], .cursor-pointer {
        -webkit-tap-highlight-color: transparent;
        touch-action: manipulation;
      }
      
      /* Otimizar inputs para mobile */
      input, textarea, select {
        -webkit-appearance: none;
        appearance: none;
        border-radius: 0.375rem;
      }
      
      /* Melhorar performance de animações (opt-in) */
      /* IMPORTANTE: não aplicar transform globalmente para não quebrar position: fixed/portals */
      .gpu-accel {
        will-change: transform;
      }
      
      /* Otimizar sidebar para mobile */
      @media (max-width: 1024px) {
        .mobile-sidebar {
          transform: translateX(-100%);
          transition: transform 0.3s ease-in-out;
        }
        
        .mobile-sidebar.open {
          transform: translateX(0);
        }
      }
      
      /* Melhorar áreas de toque */
      @media (max-width: 768px) {
        .touch-target {
          min-height: 44px;
          min-width: 44px;
        }
        
        /* Otimizar cards para mobile */
        .mobile-card {
          padding: 1rem;
          margin-bottom: 0.75rem;
        }
        
        .mobile-card h3 {
          font-size: 1rem;
          line-height: 1.5;
        }
        
        .mobile-card p {
          font-size: 0.875rem;
          line-height: 1.4;
        }
        
        /* Melhorar tabelas em mobile */
        .mobile-table {
          display: block;
          overflow-x: auto;
          white-space: nowrap;
        }
        
        .mobile-table th,
        .mobile-table td {
          padding: 0.5rem;
          font-size: 0.875rem;
        }
        
        /* Otimizar formulários */
        .mobile-form input,
        .mobile-form textarea,
        .mobile-form select {
          padding: 0.75rem;
          font-size: 1rem; /* Previne zoom no iOS */
          border-radius: 0.5rem;
        }
        
        /* Melhorar modais em mobile */
        .mobile-modal {
          margin: 1rem;
          max-height: calc(100vh - 2rem);
          overflow-y: auto;
        }
        
        /* Otimizar navegação */
        .mobile-nav {
          padding: 0.5rem;
        }
        
        .mobile-nav-item {
          padding: 0.75rem 1rem;
          margin-bottom: 0.25rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
        }
      }
      
      /* Otimizações específicas para telas muito pequenas */
      @media (max-width: 375px) {
        .text-responsive {
          font-size: 0.75rem;
        }
        
        .padding-responsive {
          padding: 0.5rem;
        }
        
        .margin-responsive {
          margin: 0.25rem;
        }
      }
      
      /* Melhorar performance de scroll */
      .scroll-container {
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        scroll-behavior: smooth;
      }
      
      /* Otimizar imagens para mobile */
      .mobile-image {
        max-width: 100%;
        height: auto;
        border-radius: 0.5rem;
      }
      
      /* Melhorar contraste para móvel */
      @media (max-width: 768px) {
        .text-muted {
          color: #374151 !important;
        }
        
        .border-light {
          border-color: #d1d5db !important;
        }
      }
      
      /* Safe area para dispositivos com notch */
      @supports (padding: max(0px)) {
        .safe-area-inset-top {
          padding-top: max(1rem, env(safe-area-inset-top));
        }
        
        .safe-area-inset-bottom {
          padding-bottom: max(1rem, env(safe-area-inset-bottom));
        }
        
        .safe-area-inset-left {
          padding-left: max(1rem, env(safe-area-inset-left));
        }
        
        .safe-area-inset-right {
          padding-right: max(1rem, env(safe-area-inset-right));
        }
      }
    `
    
    document.head.appendChild(style)

    // Prevenir zoom duplo-toque no iOS
    let lastTouchEnd = 0
    const preventDoubleTouch = (event) => {
      const now = (new Date()).getTime()
      if (now - lastTouchEnd <= 300) {
        event.preventDefault()
      }
      lastTouchEnd = now
    }
    
    document.addEventListener('touchend', preventDoubleTouch, false)

    // Melhorar performance de scroll
    const scrollElements = document.querySelectorAll('.overflow-y-auto')
    scrollElements.forEach(element => {
      element.style.webkitOverflowScrolling = 'touch'
    })

    // Cleanup
    return () => {
      document.removeEventListener('touchend', preventDoubleTouch, false)
      if (style.parentNode) {
        style.parentNode.removeChild(style)
      }
    }
  }, [])

  return null // Este componente não renderiza nada visualmente
}

export default MobileOptimizations