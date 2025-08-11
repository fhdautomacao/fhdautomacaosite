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
    allowedHosts: "all",
    // Proxy para APIs durante o desenvolvimento, evitando que o Vite sirva JS em /api/*
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "")
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['framer-motion', '@radix-ui/react-dialog', '@radix-ui/react-select'],
          // Chunks otimizados para mobile
          mobile: ['@radix-ui/react-dialog', '@radix-ui/react-select'],
          animations: ['framer-motion']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    // Otimizações para mobile
    assetsInlineLimit: 8192, // Aumentar limite para reduzir requests
    cssCodeSplit: true,
    sourcemap: false,
    // Configurações específicas para Vercel
    outDir: 'dist',
    assetsDir: 'assets',
    // Otimizações de compressão
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
  },
  // Configurações específicas para produção
  define: {
    __DEV__: false
  },
  // Otimizações para melhor performance
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: []
  },
  // Configuração para SPA
  base: '/'
})
