# 📊 Guia de Logs do Sistema SEO

## 🔍 **Como Interpretar os Logs**

### **DynamicSEO Component (Páginas Públicas)**

#### ✅ **API Funcionando:**
```
🌐 [DynamicSEO] Tentando buscar dados da API...
✅ [DynamicSEO] Dados obtidos da API com sucesso!
📊 [DynamicSEO] Título da API: FHD Automação Industrial - Soluções Hidráulicas e Pneumáticas
```

#### ⚠️ **API com Problemas:**
```
🌐 [DynamicSEO] Tentando buscar dados da API...
⚠️ [DynamicSEO] API retornou dados não-JSON, usando fallback
```

#### 🔧 **Desenvolvimento (Fallback):**
```
🔧 [DynamicSEO] Modo desenvolvimento: usando dados de fallback
```

#### ❌ **Erro na API:**
```
🌐 [DynamicSEO] Tentando buscar dados da API...
❌ [DynamicSEO] Erro ao carregar dados de SEO: [erro]
🔄 [DynamicSEO] Usando dados de fallback devido ao erro
```

---

### **SEOManager Component (Admin)**

#### ✅ **API Funcionando:**
```
🌐 [SEOManager] Tentando buscar configurações da API...
✅ [SEOManager] Configurações carregadas com sucesso!
📊 [SEOManager] Total de configurações: 6
```

#### ⚠️ **API com Problemas:**
```
🌐 [SEOManager] Tentando buscar configurações da API...
⚠️ [SEOManager] API retornou dados não-JSON
```

#### 💾 **Salvando Configuração:**
```
💾 [SEOManager] Tentando salvar configuração...
✅ [SEOManager] Configuração salva com sucesso!
```

#### 🗑️ **Deletando Configuração:**
```
🗑️ [SEOManager] Tentando deletar configuração...
✅ [SEOManager] Configuração deletada com sucesso!
```

---

## 🚀 **Cenários de Uso**

### **1. Desenvolvimento Local (Sem API)**
```bash
npm run dev
```
- **DynamicSEO:** `🔧 [DynamicSEO] Modo desenvolvimento: usando dados de fallback`
- **SEOManager:** `⚠️ [SEOManager] API retornou dados não-JSON`

### **2. Desenvolvimento Local (Com API)**
```bash
# Terminal 1
npm run server

# Terminal 2  
npm run dev
```
- **DynamicSEO:** `✅ [DynamicSEO] Dados obtidos da API com sucesso!`
- **SEOManager:** `✅ [SEOManager] Configurações carregadas com sucesso!`

### **3. Produção (Com API Funcionando)**
- **DynamicSEO:** `✅ [DynamicSEO] Dados obtidos da API com sucesso!`
- **SEOManager:** `✅ [SEOManager] Configurações carregadas com sucesso!`

### **4. Produção (Sem API)**
- **DynamicSEO:** `⚠️ [DynamicSEO] API retornou dados não-JSON, usando fallback`
- **SEOManager:** `⚠️ [SEOManager] API retornou dados não-JSON`

---

## 🎯 **O que Significa Cada Situação**

### **✅ API Funcionando**
- Banco de dados conectado
- API respondendo corretamente
- Dados dinâmicos sendo carregados
- **Ideal para produção**

### **⚠️ API com Problemas**
- API não está rodando
- Banco de dados não conectado
- Usando dados de fallback
- **Funciona, mas não é dinâmico**

### **🔧 Modo Desenvolvimento**
- Variáveis de ambiente não configuradas
- Usando dados hardcoded
- **Normal em desenvolvimento**

### **❌ Erro na API**
- Problema de rede
- Erro no servidor
- Usando dados de fallback
- **Precisa investigar**

---

## 🔧 **Como Resolver Problemas**

### **Se aparecer "API não disponível":**
1. Verifique se o servidor está rodando: `npm run server`
2. Verifique as variáveis de ambiente no `.env`
3. Verifique se o Supabase está conectado

### **Se aparecer "dados não-JSON":**
1. A API não está respondendo
2. Está retornando HTML (página 404) em vez de JSON
3. Normal quando a API não está rodando

### **Se aparecer "modo desenvolvimento":**
1. Normal quando `VITE_SUPABASE_URL` não está configurado
2. Usa dados de fallback automaticamente
3. Funciona perfeitamente para desenvolvimento

---

## 📈 **Monitoramento em Produção**

### **Logs Esperados em Produção:**
```
✅ [DynamicSEO] Dados obtidos da API com sucesso!
✅ [SEOManager] Configurações carregadas com sucesso!
```

### **Logs de Problema em Produção:**
```
⚠️ [DynamicSEO] API retornou dados não-JSON, usando fallback
⚠️ [SEOManager] API retornou dados não-JSON
```

### **Ação Necessária:**
- Verificar se a API está rodando
- Verificar conexão com Supabase
- Verificar variáveis de ambiente
