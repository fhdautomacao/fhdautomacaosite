# 🚀 Deploy e Produção

## 📋 Visão Geral

O site da FHD Automação Industrial é deployado na **Vercel** com configurações otimizadas para produção.

## 🎯 Configuração do Vercel

### **vercel.json**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    },
    {
      "src": "server-apis/api-*.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/auth/login",
      "dest": "/server-apis/api-auth-login.js"
    },
    {
      "src": "/api/auth/logout",
      "dest": "/server-apis/api-auth-logout.js"
    },
    {
      "src": "/api/test",
      "dest": "/server-apis/api-test.js"
    },
    {
      "src": "/api/bills",
      "dest": "/server-apis/api-bills.js"
    },
    {
      "src": "/api/bills/installments/upload",
      "dest": "/server-apis/api-bills-simple.js"
    },
    {
      "src": "/api/bills/installments/(.*)/receipt",
      "dest": "/server-apis/api-bills-simple.js"
    },
    {
      "src": "/api/quotations",
      "dest": "/server-apis/api-quotations.js"
    },
    {
      "src": "/api/clients",
      "dest": "/server-apis/api-clients.js"
    },
    {
      "src": "/api/dashboard",
      "dest": "/server-apis/api-dashboard.js"
    }
  ]
}
```

## 🔧 Variáveis de Ambiente

### **Variáveis Obrigatórias**
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_APP_NAME=FHD Automação

# Mobile API Configuration
NEXT_PUBLIC_MOBILE_API_URL=https://your-domain.vercel.app/api
```

### **Como Configurar no Vercel**

1. **Acesse o Dashboard do Vercel**
   - Vá para [vercel.com](https://vercel.com)
   - Faça login na sua conta
   - Selecione o projeto

2. **Configure as Variáveis**
   - Vá em **Settings** → **Environment Variables**
   - Adicione cada variável:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - `NEXT_PUBLIC_APP_URL`
     - `NEXT_PUBLIC_APP_NAME`
     - `NEXT_PUBLIC_MOBILE_API_URL`

3. **Configure os Ambientes**
   - **Production**: Para o site em produção
   - **Preview**: Para branches de desenvolvimento
   - **Development**: Para desenvolvimento local

## 🚀 Processo de Deploy

### **Deploy Automático**
- **Trigger**: Push para branch `main`
- **Build**: Automático via Vercel
- **Deploy**: Automático após build bem-sucedido

### **Deploy Manual**
```bash
# Instalar Vercel CLI
npm install -g vercel

# Login no Vercel
vercel login

# Deploy
vercel --prod
```

### **Build Local**
```bash
# Build de produção
npm run build

# Preview do build
npm run preview
```

## 📊 Monitoramento

### **Vercel Analytics**
- **Performance**: Core Web Vitals
- **Visitas**: Número de visitantes
- **Páginas**: Páginas mais acessadas
- **Dispositivos**: Desktop, mobile, tablet

### **Error Tracking**
- **Console Errors**: Erros do JavaScript
- **Network Errors**: Falhas de requisição
- **Build Errors**: Erros de build

### **Uptime Monitoring**
- **Status Page**: [vercel-status.com](https://vercel-status.com)
- **Alerts**: Notificações de downtime
- **Performance**: Tempo de resposta

## 🔐 Segurança

### **HTTPS**
- **SSL Automático**: Vercel fornece SSL gratuito
- **HSTS**: HTTP Strict Transport Security
- **CSP**: Content Security Policy

### **Headers de Segurança**
```javascript
// Headers configurados automaticamente
{
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()"
}
```

### **CORS**
```javascript
// Configuração de CORS
{
  "origin": ["https://your-domain.vercel.app"],
  "methods": ["GET", "POST", "PUT", "DELETE"],
  "credentials": true
}
```

## 📈 Performance

### **Otimizações Automáticas**
- **Code Splitting**: Divisão automática do código
- **Image Optimization**: Otimização de imagens
- **Caching**: Cache inteligente
- **CDN**: Distribuição global

### **Core Web Vitals**
- **LCP**: Largest Contentful Paint < 2.5s
- **FID**: First Input Delay < 100ms
- **CLS**: Cumulative Layout Shift < 0.1

### **Bundle Analysis**
```bash
# Analisar bundle
npm run build
npx vite-bundle-analyzer dist
```

## 🔄 CI/CD

### **GitHub Actions** (Opcional)
```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 🌍 Domínio Personalizado

### **Configurar Domínio**
1. **No Vercel Dashboard**
   - Vá em **Settings** → **Domains**
   - Clique em **Add Domain**
   - Digite seu domínio

2. **Configurar DNS**
   - Adicione os registros DNS fornecidos pelo Vercel
   - Aguarde a propagação (pode levar até 24h)

### **SSL Automático**
- **Let's Encrypt**: Certificado gratuito
- **Renovação Automática**: Sem intervenção manual
- **Wildcard**: Suporte a subdomínios

## 📱 PWA (Progressive Web App)

### **Configuração**
```json
{
  "name": "FHD Automação",
  "short_name": "FHD",
  "description": "Sistema de gestão empresarial",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## 🔍 SEO

### **Meta Tags**
```html
<meta name="description" content="FHD Automação Industrial - Soluções em automação">
<meta name="keywords" content="automação, industrial, FHD">
<meta property="og:title" content="FHD Automação">
<meta property="og:description" content="Soluções em automação industrial">
<meta property="og:image" content="https://your-domain.vercel.app/og-image.png">
```

### **Sitemap**
- **Geração Automática**: Vercel gera sitemap.xml
- **Google Search Console**: Integração automática
- **Bing Webmaster Tools**: Suporte incluído

## 🛠️ Troubleshooting

### **Problemas Comuns**

#### **Build Falha**
```bash
# Verificar logs
vercel logs

# Build local
npm run build

# Verificar dependências
npm audit
```

#### **Variáveis de Ambiente**
```bash
# Verificar variáveis
vercel env ls

# Adicionar variável
vercel env add NEXT_PUBLIC_SUPABASE_URL
```

#### **Performance Lenta**
- Verificar tamanho do bundle
- Otimizar imagens
- Implementar lazy loading
- Usar CDN para assets

### **Logs de Debug**
```javascript
// Habilitar logs detalhados
console.log('Debug:', {
  environment: process.env.NODE_ENV,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  timestamp: new Date().toISOString()
});
```

## 📊 Métricas de Produção

### **Monitoramento**
- **Uptime**: 99.9%+
- **Response Time**: < 200ms
- **Error Rate**: < 0.1%
- **Core Web Vitals**: Todos verdes

### **Alertas**
- **Downtime**: Notificação imediata
- **Performance**: Alertas de degradação
- **Errors**: Agrupamento de erros
- **Security**: Tentativas de acesso suspeitas

---

**Próximo**: [Manutenção](./manutencao.md)
