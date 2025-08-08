# 🔧 Resolver Erro: "column page_name does not exist"

## 🚨 Problema Identificado

O erro `ERROR: 42703: column "page_name" does not exist` indica que a tabela `seo_settings` não foi criada corretamente no seu banco de dados Supabase, ou a migração não foi aplicada.

## 🛠️ Solução Passo a Passo

### **Passo 1: Acessar o Supabase Dashboard**

1. Acesse [supabase.com](https://supabase.com)
2. Faça login na sua conta
3. Selecione seu projeto
4. Vá para **SQL Editor** no menu lateral

### **Passo 2: Executar o Script de Verificação**

1. No SQL Editor, clique em **"New Query"**
2. Copie e cole o conteúdo do arquivo `scripts/fix-seo-table-simple.sql`
3. Clique em **"Run"** para executar o script

### **Passo 3: Verificar o Resultado**

O script irá:
- ✅ Verificar se a tabela `seo_settings` existe
- ✅ Criar a tabela se ela não existir
- ✅ Verificar se a coluna `page_name` existe
- ✅ Adicionar a coluna se ela não existir
- ✅ Inserir dados padrão se a tabela estiver vazia
- ✅ Mostrar um relatório final

### **Passo 4: Confirmar a Correção**

Após executar o script, você deve ver uma mensagem como:
```
Verificação concluída!
total_configuracoes: 6
configuracoes_ativas: 6
paginas_configuradas: about, clients, contact, home, quotation, services
```

## 🔍 Verificação Manual

Se quiser verificar manualmente, execute estas queries:

### **Verificar se a tabela existe:**
```sql
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_name = 'seo_settings'
);
```

### **Verificar se a coluna page_name existe:**
```sql
SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'seo_settings' 
    AND column_name = 'page_name'
);
```

### **Verificar dados na tabela:**
```sql
SELECT page_name, title, is_active 
FROM seo_settings 
ORDER BY page_name;
```

## 🚀 Testar o Sistema

Após corrigir o banco de dados:

1. **Teste a API:**
   ```bash
   curl "https://seu-projeto.supabase.co/rest/v1/seo_settings?page_name=home"
   ```

2. **Teste o Admin Panel:**
   - Acesse a página de administração
   - Vá para a seção "SEO"
   - Verifique se as configurações aparecem

3. **Teste o Componente DynamicSEO:**
   - Verifique se as meta tags estão sendo aplicadas corretamente

## 🔧 Soluções Alternativas

### **Se o script não funcionar:**

1. **Criar a tabela manualmente:**
   ```sql
   CREATE TABLE seo_settings (
       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
       page_name VARCHAR(100) NOT NULL UNIQUE,
       title VARCHAR(255),
       description TEXT,
       keywords TEXT,
       canonical_url VARCHAR(500),
       og_title VARCHAR(255),
       og_description TEXT,
       og_image VARCHAR(500),
       og_type VARCHAR(50) DEFAULT 'website',
       og_site_name VARCHAR(100),
       og_locale VARCHAR(10) DEFAULT 'pt_BR',
       twitter_card VARCHAR(50) DEFAULT 'summary_large_image',
       twitter_title VARCHAR(255),
       twitter_description TEXT,
       twitter_image VARCHAR(500),
       structured_data JSONB,
       robots VARCHAR(100) DEFAULT 'index, follow',
       author VARCHAR(100),
       viewport VARCHAR(100) DEFAULT 'width=device-width, initial-scale=1.0',
       charset VARCHAR(20) DEFAULT 'UTF-8',
       favicon_url VARCHAR(500),
       is_active BOOLEAN DEFAULT true,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

2. **Adicionar índice:**
   ```sql
   CREATE INDEX idx_seo_settings_page_name ON seo_settings(page_name);
   ```

3. **Inserir dados padrão:**
   ```sql
   INSERT INTO seo_settings (page_name, title, description) VALUES
   ('home', 'FHD Automação Industrial', 'Especialistas em automação industrial'),
   ('about', 'Quem Somos', 'Conheça nossa história'),
   ('services', 'Nossos Serviços', 'Serviços de automação industrial');
   ```

## 📞 Suporte

Se ainda tiver problemas:

1. **Verifique os logs do Supabase** em **Logs** → **Database**
2. **Teste a conexão** em **Settings** → **Database**
3. **Verifique as políticas RLS** em **Authentication** → **Policies**

## ✅ Checklist de Verificação

- [ ] Tabela `seo_settings` existe
- [ ] Coluna `page_name` existe
- [ ] Dados padrão foram inseridos
- [ ] API `/api/seo-settings` funciona
- [ ] Admin panel carrega sem erros
- [ ] Componente DynamicSEO funciona
- [ ] Meta tags são aplicadas corretamente

## 🎯 Próximos Passos

Após resolver o problema:

1. **Configure as políticas RLS** para a tabela `seo_settings`
2. **Teste todas as funcionalidades** do sistema SEO
3. **Personalize as configurações** para suas páginas
4. **Monitore o desempenho** das meta tags

---

**💡 Dica:** Sempre execute as migrações em ambiente de desenvolvimento antes de aplicar em produção!
