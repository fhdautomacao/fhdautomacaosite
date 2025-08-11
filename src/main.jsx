import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { I18nProvider } from './i18n/index.jsx'
import { initializeSecurity } from './lib/securityConfig'
import { SpeedInsights } from '@vercel/speed-insights/react'

// Suprimir warning específico do Framer Motion sobre scroll container
const originalWarn = console.warn
console.warn = (...args) => {
  if (args[0]?.includes?.('non-static position') || 
      args[0]?.includes?.('scroll offset is calculated correctly')) {
    return
  }
  originalWarn.apply(console, args)
}

// Inicializar sistema de segurança
initializeSecurity()

const isDev = import.meta.env.DEV

createRoot(document.getElementById('root')).render(
  isDev ? (
    <>
      <I18nProvider>
        <App />
      </I18nProvider>
      <SpeedInsights />
    </>
  ) : (
    <StrictMode>
      <I18nProvider>
        <App />
      </I18nProvider>
      <SpeedInsights />
    </StrictMode>
  ),
)
