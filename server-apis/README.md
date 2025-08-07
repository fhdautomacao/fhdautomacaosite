# APIs do Servidor (Raiz)

Esta pasta contém todas as APIs do servidor que estavam anteriormente na raiz do projeto.

## Estrutura

```
server-apis/
├── api/                    # Pasta api original da raiz
│   ├── bills/             # APIs de boletos
│   ├── auth/              # APIs de autenticação
│   ├── notify-mobile.js   # Notificação mobile
│   └── test.js            # Teste de API
├── api-bills-simple.js    # Upload de comprovantes
├── api-dashboard.js       # Dados do dashboard
├── api-clients.js         # Gerenciamento de clientes
├── api-quotations.js      # Gerenciamento de cotações
├── api-auth-login.js      # Login
├── api-auth-logout.js     # Logout
├── api-test.js            # Teste de conexão
└── README.md              # Esta documentação
```

## APIs Principais

### `api-bills-simple.js`
Gerencia upload e exclusão de comprovantes de pagamento.
- **Endpoint**: `/api/bills/installments/upload`
- **Endpoint**: `/api/bills/installments/{id}/receipt`

### `api-dashboard.js`
Fornece dados e estatísticas do dashboard.
- **Endpoint**: `/api/dashboard`

### `api-clients.js`
Gerencia operações de clientes.
- **Endpoint**: `/api/clients`

### `api-quotations.js`
Gerencia operações de cotações.
- **Endpoint**: `/api/quotations`

### `api-auth-login.js`
Gerencia autenticação de login.
- **Endpoint**: `/api/auth/login`

### `api-auth-logout.js`
Gerencia logout de usuários.
- **Endpoint**: `/api/auth/logout`

### `api-test.js`
Teste de conexão com o servidor.
- **Endpoint**: `/api/test`

## Configuração no Vercel

As rotas estão configuradas no arquivo `vercel.json` na raiz do projeto:

```json
{
  "builds": [
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
    // ... outras rotas
  ]
}
```

## Diferença das APIs do Frontend

- **APIs do Frontend** (`src/api/`): Comunicam diretamente com o Supabase
- **APIs do Servidor** (`server-apis/`): Comunicam através de endpoints do servidor para operações que requerem processamento no servidor

## Organização Anterior

Antes da reorganização, estas APIs estavam espalhadas na raiz do projeto:
- `api-bills-simple.js` ✅ **MOVIDA**
- `api-dashboard.js` ✅ **MOVIDA**
- `api-clients.js` ✅ **MOVIDA**
- `api-quotations.js` ✅ **MOVIDA**
- `api-auth-login.js` ✅ **MOVIDA**
- `api-auth-logout.js` ✅ **MOVIDA**
- `api-test.js` ✅ **MOVIDA**
- `api/` (pasta) ✅ **MOVIDA**

Agora todas estão organizadas em uma única pasta para melhor manutenção e organização.
