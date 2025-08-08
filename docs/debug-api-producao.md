# 🔍 Debug da API em Produção

## 📊 **Logs Detalhados Adicionados**

### **No Frontend (DynamicSEO):**
```
🌐 [DynamicSEO] Tentando buscar dados da API...
⚠️ [DynamicSEO] API retornou dados não-JSON, usando fallback
🔍 [DynamicSEO] Content-Type recebido: text/html
🔍 [DynamicSEO] Status da resposta: 404
🔍 [DynamicSEO] URL da API: /api/seo-settings?page_name=home
🔍 [DynamicSEO] Corpo da resposta: <!DOCTYPE html><html>...
```

### **Na API (Vercel Functions):**
```
🚀 [API] Requisição recebida: GET /api/seo-settings
🔍 [API] Query params: { page_name: 'home' }
🔍 [API] Headers: { ... }
📥 [API] Executando GET
🔍 [API] Buscando configuração para page_name: home
🔍 [API] Buscando configuração específica...
✅ [API] Configuração encontrada para: home
🔍 [API] Dados retornados: { ... }
```

## 🎯 **O que Procurar nos Logs**

### **1. Se a API não está sendo chamada:**
```
🌐 [DynamicSEO] Tentando buscar dados da API...
⚠️ [DynamicSEO] API retornou dados não-JSON, usando fallback
🔍 [DynamicSEO] Content-Type recebido: text/html
🔍 [DynamicSEO] Status da resposta: 404
```
**Problema:** A API function não existe ou não está sendo encontrada

### **2. Se a API está sendo chamada mas com erro:**
```
🚀 [API] Requisição recebida: GET /api/seo-settings
❌ [API] Erro ao buscar configuração: { ... }
```
**Problema:** Erro no Supabase ou variáveis de ambiente

### **3. Se a API está funcionando:**
```
🚀 [API] Requisição recebida: GET /api/seo-settings
✅ [API] Configuração encontrada para: home
✅ [DynamicSEO] Dados obtidos da API com sucesso!
```

## 🔧 **Possíveis Problemas e Soluções**

### **Problema 1: API não encontrada (404)**
- **Causa:** A API function não foi deployada corretamente
- **Solução:** Verificar se o arquivo `api/seo-settings.js` está no repositório

### **Problema 2: Erro de variáveis de ambiente**
- **Causa:** `VITE_SUPABASE_URL` ou `SUPABASE_SERVICE_ROLE_KEY` não configuradas
- **Solução:** Verificar no dashboard do Vercel

### **Problema 3: Erro no Supabase**
- **Causa:** Tabela `seo_settings` não existe ou não tem dados
- **Solução:** Executar o script SQL no Supabase

### **Problema 4: Erro de CORS**
- **Causa:** Configuração de CORS incorreta
- **Solução:** Verificar headers na API

## 📋 **Checklist de Debug**

1. **Verificar se a API está sendo chamada:**
   - Procurar por `🚀 [API] Requisição recebida`

2. **Verificar se as variáveis estão configuradas:**
   - Procurar por `❌ Variáveis de ambiente do Supabase não configuradas!`

3. **Verificar se o Supabase está respondendo:**
   - Procurar por `❌ [API] Erro ao buscar configuração`

4. **Verificar se os dados existem:**
   - Procurar por `⚠️ [API] Configuração não encontrada para:`

## 🚀 **Próximos Passos**

1. **Faça o deploy** com os novos logs
2. **Acesse o site** em produção
3. **Abra o console** do navegador
4. **Copie todos os logs** e me envie
5. **Verifique os logs do Vercel** no dashboard

Com esses logs detalhados, vamos conseguir identificar exatamente onde está o problema! 🔍
