# Alteração da Duração da Sessão para 5 Horas

## Alteração Realizada

A duração da sessão JWT foi alterada de **24 horas** para **5 horas** por solicitação do usuário.

## Arquivos Modificados

### 1. api/auth.js

#### Configuração JWT:
```javascript
// Antes:
const JWT_EXPIRES_IN = '24h'

// Depois:
const JWT_EXPIRES_IN = '5h'
```

#### Cálculo de expiração no login:
```javascript
// Antes:
const expiresAt = new Date(Date.now() + (24 * 60 * 60 * 1000))

// Depois:
const expiresAt = new Date(Date.now() + (5 * 60 * 60 * 1000))
```

#### Cálculo de expiração na renovação:
```javascript
// Antes:
const expiresAt = new Date(Date.now() + (24 * 60 * 60 * 1000))

// Depois:
const expiresAt = new Date(Date.now() + (5 * 60 * 60 * 1000))
```

### 2. src/components/AdminHeader.jsx

#### Tempo de expiração exibido:
```javascript
// Antes:
const expiry = new Date(now.getTime() + (23 * 60 * 60 * 1000)) // 23 horas restantes

// Depois:
const expiry = new Date(now.getTime() + (4 * 60 * 60 * 1000)) // 4 horas restantes (aproximado)
```

## Comportamento da Sessão

### Duração Total: 5 horas
- **Login**: Token válido por 5 horas
- **Renovação automática**: 5 minutos antes de expirar
- **Verificação**: A cada minuto
- **Expiração**: Após 5 horas exatas

### Fluxo de Renovação
1. **Login**: 5 horas de validade
2. **4h 55min**: Sistema tenta renovar automaticamente
3. **Se renovação falhar**: Usuário é redirecionado para login
4. **Se renovação funcionar**: +5 horas adicionais

## Benefícios da Alteração

1. **Maior segurança**: Sessões mais curtas reduzem o risco de acesso não autorizado
2. **Controle de acesso**: Usuários precisam fazer login mais frequentemente
3. **Conformidade**: Atende a políticas de segurança mais rigorosas
4. **Flexibilidade**: Pode ser ajustado conforme necessidades da empresa

## Monitoramento

Para monitorar o funcionamento:

1. **Console do navegador**: Verificar logs de renovação automática
2. **Tempo de expiração**: Observar contador no header
3. **Redirecionamento**: Confirmar logout automático após 5 horas
4. **Renovação**: Verificar se renova automaticamente antes de expirar

## Reversão

Se necessário reverter para 24 horas:

```javascript
// Em api/auth.js
const JWT_EXPIRES_IN = '24h'
const expiresAt = new Date(Date.now() + (24 * 60 * 60 * 1000))

// Em AdminHeader.jsx
const expiry = new Date(now.getTime() + (23 * 60 * 60 * 1000))
```

## Testes Recomendados

- ✅ Login funciona com nova duração
- ✅ Renovação automática funciona
- ✅ Logout automático após 5 horas
- ✅ Contador de tempo exibido corretamente
- ✅ Redirecionamento para login após expiração
