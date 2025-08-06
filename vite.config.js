import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    allowedHosts: "all"
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['framer-motion', '@radix-ui/react-dialog', '@radix-ui/react-select']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    // Garantir que os assets sejam servidos corretamente
    assetsInlineLimit: 4096,
    cssCodeSplit: true,
    sourcemap: false
  },
  plugins: [react(),tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Configurações específicas para produção
  define: {
    __DEV__: false
  },
  // Otimizações para melhor performance
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
})
