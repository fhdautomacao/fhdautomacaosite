# Proteção CORS - FHD Automação

## Visão Geral

Este documento explica a implementação da proteção CORS (Cross-Origin Resource Sharing) no projeto FHD Automação, que permite apenas a comunicação segura entre a página de ADMIN e o frontend com o banco de dados.

## Configuração Implementada

### 1. Servidor (server.js)

O servidor foi configurado com as seguintes proteções:

#### CORS Configuration
- **Origens Permitidas**: Apenas domínios específicos podem acessar a API
- **Métodos Permitidos**: GET, POST, PUT, DELETE, OPTIONS
- **Headers Permitidos**: Origin, X-Requested-With, Content-Type, Accept, Authorization, X-API-Key
- **Credentials**: Habilitado para cookies e headers de autenticação

#### Autenticação Admin
- **Middleware de Proteção**: Todas as rotas administrativas requerem autenticação
- **Identificação Admin**: Requisições da página admin são identificadas automaticamente
- **API Key**: Suporte para validação de chave de API
- **Bearer Token**: Suporte para tokens de autenticação

### 2. Frontend (src/lib/api-config.js)

Configuração para chamadas de API com autenticação adequada:

#### Detecção Automática
- **Admin Page**: Detecta automaticamente se está na página admin
- **Headers Dinâmicos**: Adiciona headers de autenticação conforme necessário
- **Token Management**: Gerencia tokens de autenticação no localStorage

#### Funções de API
- **apiRequest**: Função genérica para requisições HTTP
- **seoApi**: Funções específicas para SEO Settings
- **setupAdminAuth**: Configuração de autenticação admin

## Configuração de Ambiente

### Variáveis Necessárias

Adicione estas variáveis ao seu arquivo `.env`:

```env
# API Configuration
VITE_API_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=https://fhdautomacaoindustrialapp.vercel.app/api

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,https://fhdautomacaoindustrialapp.vercel.app

# Admin Authentication
ADMIN_API_KEY=your_admin_api_key_here
```

### Origem Permitidas

As seguintes origens são permitidas por padrão:

- `http://localhost:5173` - Frontend local (Vite)
- `http://localhost:3000` - Frontend alternativo
- `https://fhd-automacao-industrial-bq67.vercel.app` - Produção antiga
- `https://fhdautomacaoindustrialapp.vercel.app` - Nova produção
- URLs configuradas em `ALLOWED_ORIGINS`

## Como Usar

### 1. Frontend Público

Para páginas públicas, use normalmente:

```javascript
import { seoApi } from '@/lib/api-config'

// Buscar configurações de SEO
const settings = await seoApi.getSettings('home')
```

### 2. Página Admin

Para páginas administrativas, a autenticação é automática:

```javascript
import { seoApi, setupAdminAuth } from '@/lib/api-config'

// Configurar autenticação admin (no login)
setupAdminAuth('your-admin-token')

// Fazer requisições (autenticação automática)
const result = await seoApi.saveSettings(seoData)
```

### 3. Headers Personalizados

Para requisições com headers específicos:

```javascript
import { apiRequest } from '@/lib/api-config'

const result = await apiRequest('/custom-endpoint', {
  method: 'POST',
  headers: {
    'X-Custom-Header': 'value'
  },
  body: JSON.stringify(data)
})
```

## Segurança

### Proteções Implementadas

1. **CORS Restritivo**: Apenas origens permitidas podem acessar a API
2. **Autenticação Admin**: Requisições admin requerem autenticação
3. **Validação de Headers**: Headers de autenticação são validados
4. **Logs de Segurança**: Tentativas de acesso não autorizado são logadas
5. **Referer Validation**: Verificação do referer para identificar requisições admin

### Boas Práticas

1. **Nunca exponha API keys** no código frontend
2. **Use HTTPS** em produção
3. **Valide tokens** no servidor
4. **Monitore logs** de tentativas de acesso não autorizado
5. **Atualize origens permitidas** conforme necessário

## Troubleshooting

### Erro: "Não permitido pelo CORS"

**Causa**: Origem não está na lista de permitidas
**Solução**: Adicione a origem ao `ALLOWED_ORIGINS` ou configure no servidor

### Erro: "Acesso não autorizado"

**Causa**: Requisição admin sem autenticação
**Solução**: Configure autenticação admin ou remova header `X-Admin-Request`

### Erro: "API Key inválida"

**Causa**: API key incorreta ou não configurada
**Solução**: Configure `ADMIN_API_KEY` no ambiente ou use Bearer token

## Monitoramento

### Logs do Servidor

O servidor loga automaticamente:

- ✅ Requisições autorizadas
- 🚫 Tentativas de acesso não autorizado
- 📡 Todas as requisições com origem

### Exemplo de Logs

```
📡 GET /seo-settings - Origin: http://localhost:5173
✅ Acesso admin autorizado
🚫 CORS bloqueado para origem: https://malicious-site.com
🚫 Tentativa de acesso admin sem autenticação
```

## Atualizações Futuras

Para adicionar novas origens ou modificar a configuração:

1. Atualize `ALLOWED_ORIGINS` no arquivo `.env`
2. Modifique `corsOptions` em `server.js` se necessário
3. Atualize `api-config.js` para novos endpoints
4. Teste em ambiente de desenvolvimento antes de produção
