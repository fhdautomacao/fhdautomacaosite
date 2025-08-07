# APIs do Servidor

Esta pasta contém as APIs que se comunicam com os endpoints do servidor (configurados no `vercel.json`).

## Estrutura

```
server-apis/
├── index.js          # Arquivo de índice para exportações
├── bills-simple.js   # Upload e gerenciamento de comprovantes
├── dashboard.js      # Dados do dashboard
├── auth.js          # Autenticação no servidor
└── README.md        # Esta documentação
```

## APIs Disponíveis

### `bills-simple.js`
Gerencia upload e exclusão de comprovantes de pagamento.

```javascript
import { billsSimpleAPI } from '@/api/server-apis/bills-simple'

// Upload de comprovante
await billsSimpleAPI.uploadReceipt(installmentId, file)

// Deletar comprovante
await billsSimpleAPI.deleteReceipt(installmentId)
```

### `dashboard.js`
Busca dados e estatísticas do dashboard.

```javascript
import { dashboardAPI } from '@/api/server-apis/dashboard'

// Buscar dados do dashboard
const data = await dashboardAPI.getDashboardData()

// Buscar estatísticas
const stats = await dashboardAPI.getDashboardStats()
```

### `auth.js`
Gerencia autenticação no servidor.

```javascript
import { authServerAPI } from '@/api/server-apis/auth'

// Login no servidor
await authServerAPI.loginServer(email, password)

// Logout no servidor
await authServerAPI.logoutServer()

// Testar conexão
await authServerAPI.testServerConnection()
```

## Endpoints Correspondentes

Estas APIs se comunicam com os seguintes endpoints (configurados no `vercel.json`):

- `/api/bills/installments/upload` - Upload de comprovantes
- `/api/bills/installments/{id}/receipt` - Deletar comprovantes
- `/api/dashboard` - Dados do dashboard
- `/api/auth/login` - Login
- `/api/auth/logout` - Logout
- `/api/test` - Teste de conexão

## Diferença das APIs do Frontend

- **APIs do Frontend**: Comunicam diretamente com o Supabase
- **APIs do Servidor**: Comunicam através de endpoints do servidor para operações que requerem processamento no servidor (como upload de arquivos, autenticação, etc.)
