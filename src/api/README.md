# Organização das APIs

Este diretório contém todas as APIs organizadas do projeto, divididas em duas categorias principais:

## APIs do Frontend (Comunicação Direta com Supabase)

Estas APIs se comunicam diretamente com o Supabase e são usadas pelo frontend:

- `bills.js` - Gerenciamento de boletos
- `quotations.js` - Gerenciamento de cotações
- `clients.js` - Gerenciamento de clientes
- `companies.js` - Gerenciamento de empresas
- `products.js` - Gerenciamento de produtos
- `services.js` - Gerenciamento de serviços
- `gallery.js` - Gerenciamento da galeria
- `contact.js` - Gerenciamento de contatos
- `contactInfo.js` - Informações de contato
- `about.js` - Informações sobre a empresa
- `hero.js` - Seção hero da página
- `categories.js` - Gerenciamento de categorias
- `storage.js` - Gerenciamento de armazenamento
- `seo.js` - Otimização para SEO
- `testimonials.js` - Depoimentos
- `profitSharing.js` - Compartilhamento de lucros
- `auth.js` - Autenticação

## APIs do Servidor (Comunicação via Endpoints)

Estas APIs se comunicam através de endpoints do servidor e são usadas para operações que requerem processamento no servidor:

### Pasta `server-apis/`
- `bills-simple.js` - Upload e gerenciamento de comprovantes de pagamento
- `dashboard.js` - Dados do dashboard
- `auth.js` - Autenticação no servidor

## Como Usar

### Importar APIs do Frontend

```javascript
import { billsAPI, quotationsAPI, clientsAPI } from '@/api'
```

### Importar APIs do Servidor

```javascript
// Importar todas as APIs do servidor
import { billsSimpleAPI, dashboardAPI, authServerAPI } from '@/api'

// Ou importar diretamente da pasta server-apis
import { billsSimpleAPI } from '@/api/server-apis/bills-simple'
import { dashboardAPI } from '@/api/server-apis/dashboard'
import { authServerAPI } from '@/api/server-apis/auth'
```

### Exemplo de Uso

```javascript
// API do frontend
const bills = await billsAPI.getAll()

// API do servidor
const dashboardData = await dashboardAPI.getDashboardData()
```

## Arquivos Originais

As APIs originais que estavam na raiz do projeto foram organizadas aqui:

- `api-bills-simple.js` → `server-apis/bills-simple.js`
- `api-dashboard.js` → `server-apis/dashboard.js`
- `api-auth-login.js` e `api-auth-logout.js` → `server-apis/auth.js`

Essas APIs continuam funcionando através dos endpoints configurados no `vercel.json`.
