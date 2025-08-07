# 🔧 APIs e Endpoints

## 📋 Visão Geral

O sistema utiliza duas camadas de APIs:

1. **APIs do Frontend** - Comunicação direta com Supabase
2. **APIs do Servidor** - Endpoints customizados no Vercel

## 🎯 APIs do Frontend (Supabase)

### **Autenticação**
```javascript
import { authAPI } from '@/api/auth'

// Login
await authAPI.login(email, password)

// Logout
await authAPI.logout()

// Verificar sessão
await authAPI.getSession()
```

### **Gerenciamento de Boletos**
```javascript
import { billsAPI } from '@/api/bills'

// Criar boleto
await billsAPI.create(billData)

// Buscar todos
await billsAPI.getAll()

// Buscar por ID
await billsAPI.getById(id)

// Atualizar
await billsAPI.update(id, updates)

// Deletar
await billsAPI.delete(id)
```

### **Gerenciamento de Cotações**
```javascript
import { quotationsAPI } from '@/api/quotations'

// Criar cotação
await quotationsAPI.create(quotationData)

// Buscar todas
await quotationsAPI.getAll()

// Buscar por ID
await quotationsAPI.getById(id)

// Atualizar
await quotationsAPI.update(id, updates)

// Deletar
await quotationsAPI.delete(id)
```

### **Gerenciamento de Clientes**
```javascript
import { clientsAPI } from '@/api/clients'

// Criar cliente
await clientsAPI.create(clientData)

// Buscar todos
await clientsAPI.getAll()

// Buscar por ID
await clientsAPI.getById(id)

// Atualizar
await clientsAPI.update(id, updates)

// Deletar
await clientsAPI.delete(id)
```

### **Gerenciamento de Empresas**
```javascript
import { companiesAPI } from '@/api/companies'

// Criar empresa
await companiesAPI.create(companyData)

// Buscar todas
await companiesAPI.getAll()

// Buscar por ID
await companiesAPI.getById(id)

// Atualizar
await companiesAPI.update(id, updates)

// Deletar
await companiesAPI.delete(id)
```

## 🚀 APIs do Servidor (Vercel)

### **Upload de Comprovantes**
```javascript
import { billsSimpleAPI } from '@/api/server-apis/bills-simple'

// Upload de comprovante
await billsSimpleAPI.uploadReceipt(installmentId, file)

// Deletar comprovante
await billsSimpleAPI.deleteReceipt(installmentId)
```

### **Dashboard**
```javascript
import { dashboardAPI } from '@/api/server-apis/dashboard'

// Buscar dados do dashboard
await dashboardAPI.getDashboardData()

// Buscar estatísticas
await dashboardAPI.getDashboardStats()
```

### **Autenticação no Servidor**
```javascript
import { authServerAPI } from '@/api/server-apis/auth'

// Login no servidor
await authServerAPI.loginServer(email, password)

// Logout no servidor
await authServerAPI.logoutServer()

// Testar conexão
await authServerAPI.testServerConnection()
```

## 📡 Endpoints HTTP

### **Autenticação**
```
POST /api/auth/login
POST /api/auth/logout
GET  /api/test
```

### **Boletos**
```
GET    /api/bills
POST   /api/bills
GET    /api/bills/:id
PUT    /api/bills/:id
DELETE /api/bills/:id

POST   /api/bills/installments/upload
DELETE /api/bills/installments/:id/receipt
```

### **Dashboard**
```
GET /api/dashboard
GET /api/dashboard/stats
```

### **Cotações**
```
GET    /api/quotations
POST   /api/quotations
GET    /api/quotations/:id
PUT    /api/quotations/:id
DELETE /api/quotations/:id
```

### **Clientes**
```
GET    /api/clients
POST   /api/clients
GET    /api/clients/:id
PUT    /api/clients/:id
DELETE /api/clients/:id
```

## 🔐 Autenticação e Autorização

### **Headers Necessários**
```javascript
// Para APIs do Supabase
{
  'Authorization': `Bearer ${accessToken}`,
  'Content-Type': 'application/json'
}

// Para APIs do servidor
{
  'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
  'Content-Type': 'application/json'
}
```

### **Tratamento de Erros**
```javascript
try {
  const result = await apiCall()
  return result
} catch (error) {
  console.error('Erro na API:', error)
  throw new Error(error.message || 'Erro desconhecido')
}
```

## 📊 Estrutura de Respostas

### **Sucesso**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "created_at": "2025-01-01T00:00:00Z",
    "updated_at": "2025-01-01T00:00:00Z"
  }
}
```

### **Erro**
```json
{
  "success": false,
  "error": "Mensagem de erro",
  "code": "ERROR_CODE"
}
```

## 🔄 Real-time Subscriptions

### **Boletos em Tempo Real**
```javascript
import { supabase } from '@/lib/supabase'

const subscription = supabase
  .channel('bills')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'bills'
  }, (payload) => {
    console.log('Mudança nos boletos:', payload)
  })
  .subscribe()
```

### **Cotações em Tempo Real**
```javascript
const subscription = supabase
  .channel('quotations')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'quotations'
  }, (payload) => {
    console.log('Mudança nas cotações:', payload)
  })
  .subscribe()
```

## 📁 Organização das APIs

### **APIs do Frontend** (`src/api/`)
```
src/api/
├── bills.js              # Gerenciamento de boletos
├── quotations.js         # Gerenciamento de cotações
├── clients.js            # Gerenciamento de clientes
├── companies.js          # Gerenciamento de empresas
├── products.js           # Gerenciamento de produtos
├── services.js           # Gerenciamento de serviços
├── gallery.js            # Gerenciamento da galeria
├── contact.js            # Gerenciamento de contatos
├── contactInfo.js        # Informações de contato
├── about.js              # Informações sobre a empresa
├── hero.js               # Seção hero da página
├── categories.js         # Gerenciamento de categorias
├── storage.js            # Gerenciamento de armazenamento
├── seo.js                # Otimização para SEO
├── testimonials.js       # Depoimentos
├── profitSharing.js      # Compartilhamento de lucros
├── auth.js               # Autenticação
└── index.js              # Arquivo de índice
```

### **APIs do Servidor** (`src/api/server-apis/`)
```
src/api/server-apis/
├── bills-simple.js       # Upload de comprovantes
├── dashboard.js          # Dados do dashboard
├── auth.js               # Autenticação no servidor
└── index.js              # Arquivo de índice
```

### **APIs da Raiz** (`server-apis/`)
```
server-apis/
├── api-bills-simple.js   # Upload de comprovantes
├── api-dashboard.js      # Dados do dashboard
├── api-clients.js        # Gerenciamento de clientes
├── api-quotations.js     # Gerenciamento de cotações
├── api-auth-login.js     # Login
├── api-auth-logout.js    # Logout
├── api-test.js           # Teste de conexão
└── api/                  # APIs organizadas
    ├── bills/
    ├── auth/
    ├── notify-mobile.js
    └── test.js
```

## 🛠️ Configuração do Vercel

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

## 📈 Monitoramento e Logs

### **Logs de API**
```javascript
// Log de requisição
console.log('API Request:', {
  method: req.method,
  url: req.url,
  headers: req.headers
})

// Log de resposta
console.log('API Response:', {
  status: res.statusCode,
  data: result
})
```

### **Métricas**
- Tempo de resposta
- Taxa de erro
- Uso de recursos
- Requisições por minuto

---

**Próximo**: [Componentes e UI](./componentes-ui.md)
