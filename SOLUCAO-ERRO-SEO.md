# 🚨 SOLUÇÃO PARA O ERRO: "column page_name does not exist"

## 📋 Resumo do Problema

O erro `ERROR: 42703: column "page_name" does not exist` indica que a tabela `seo_settings` não foi criada corretamente no seu banco de dados Supabase.

## 🛠️ SOLUÇÃO RÁPIDA

### **1. Execute o Script de Correção**

1. Acesse o **Supabase Dashboard**
2. Vá para **SQL Editor**
3. Crie uma nova query
4. Cole e execute o conteúdo do arquivo: `scripts/verify-seo-table.sql`

### **2. Verifique o Resultado**

Após executar o script, você deve ver:
```
Verificação concluída!
total_configuracoes: 6
configuracoes_ativas: 6
paginas_configuradas: about, clients, contact, home, quotation, services
```

## 🔧 SOLUÇÃO MANUAL (se o script não funcionar)

### **Passo 1: Criar a Tabela**
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

### **Passo 2: Criar Índices**
```sql
CREATE INDEX idx_seo_settings_page_name ON seo_settings(page_name);
CREATE INDEX idx_seo_settings_active ON seo_settings(is_active);
```

### **Passo 3: Inserir Dados Padrão**
```sql
INSERT INTO seo_settings (page_name, title, description, keywords, canonical_url, og_title, og_description, og_image, og_site_name, twitter_title, twitter_description, twitter_image, author, structured_data) VALUES
('home', 'FHD Automação Industrial - Soluções Hidráulicas e Pneumáticas', 'FHD Automação Industrial oferece soluções completas em automação hidráulica e pneumática. Mais de 10 anos de experiência, 500+ projetos realizados e 98% de satisfação dos clientes.', 'automação industrial, hidráulica, pneumática, cilindros hidráulicos, bombas hidráulicas, válvulas, unidades hidráulicas, manutenção industrial, Sumaré, São Paulo', 'https://fhdautomacao.com.br', 'FHD Automação Industrial - Soluções Hidráulicas e Pneumáticas', 'Especialistas em automação industrial com mais de 10 anos de experiência. Oferecemos soluções completas para suas necessidades hidráulicas e pneumáticas.', 'https://fhdautomacao.com.br/og-image.jpg', 'FHD Automação Industrial', 'FHD Automação Industrial - Soluções Hidráulicas e Pneumáticas', 'Especialistas em automação industrial com mais de 10 anos de experiência. Oferecemos soluções completas para suas necessidades hidráulicas e pneumáticas.', 'https://fhdautomacao.com.br/og-image.jpg', 'FHD Automação Industrial', '{"@context": "https://schema.org", "@type": "Organization", "name": "FHD Automação Industrial", "description": "Especialistas em automação industrial, hidráulica e pneumática", "url": "https://fhdautomacao.com.br", "logo": "https://fhdautomacao.com.br/logo.png", "contactPoint": {"@type": "ContactPoint", "telephone": "+55-19-99865-2144", "contactType": "customer service", "email": "comercial@fhdautomacao.com.br"}, "address": {"@type": "PostalAddress", "streetAddress": "R. João Ediberti Biondo, 336", "addressLocality": "Sumaré", "addressRegion": "SP", "postalCode": "13171-446", "addressCountry": "BR"}, "sameAs": ["https://www.linkedin.com/company/fhd-automacao", "https://www.instagram.com/fhdautomacao"]}'),
('about', 'Quem Somos - FHD Automação Industrial', 'Conheça a história da FHD Automação Industrial. Mais de 10 anos de experiência em soluções hidráulicas e pneumáticas, com sede em Sumaré, SP.', 'sobre FHD Automação, história empresa, automação industrial Sumaré, missão visão valores, equipe especializada', 'https://fhdautomacao.com.br/quem-somos', 'Quem Somos - FHD Automação Industrial', 'Conheça a história da FHD Automação Industrial. Mais de 10 anos de experiência em soluções hidráulicas e pneumáticas.', 'https://fhdautomacao.com.br/og-image.jpg', 'FHD Automação Industrial', 'Quem Somos - FHD Automação Industrial', 'Conheça a história da FHD Automação Industrial. Mais de 10 anos de experiência em soluções hidráulicas e pneumáticas.', 'https://fhdautomacao.com.br/og-image.jpg', 'FHD Automação Industrial', '{"@context": "https://schema.org", "@type": "Organization", "name": "FHD Automação Industrial", "description": "Especialistas em automação industrial, hidráulica e pneumática", "url": "https://fhdautomacao.com.br", "logo": "https://fhdautomacao.com.br/logo.png"}'),
('services', 'Nossos Serviços - FHD Automação Industrial', 'Conheça todos os serviços da FHD Automação Industrial: automação hidráulica e pneumática, projetos personalizados, manutenção especializada e muito mais.', 'serviços automação industrial, manutenção hidráulica, projetos pneumáticos, instalação tubulações, fabricação unidades hidráulicas', 'https://fhdautomacao.com.br/servicos', 'Nossos Serviços - FHD Automação Industrial', 'Conheça todos os serviços da FHD Automação Industrial: automação hidráulica e pneumática, projetos personalizados, manutenção especializada.', 'https://fhdautomacao.com.br/og-image.jpg', 'FHD Automação Industrial', 'Nossos Serviços - FHD Automação Industrial', 'Conheça todos os serviços da FHD Automação Industrial: automação hidráulica e pneumática, projetos personalizados, manutenção especializada.', 'https://fhdautomacao.com.br/og-image.jpg', 'FHD Automação Industrial', '{"@context": "https://schema.org", "@type": "Service", "name": "FHD Automação Industrial", "description": "Serviços de automação industrial, hidráulica e pneumática", "provider": {"@type": "Organization", "name": "FHD Automação Industrial"}}'),
('contact', 'Contato - FHD Automação Industrial', 'Entre em contato com a FHD Automação Industrial. Especialistas em automação hidráulica e pneumática em Sumaré, SP. Solicite um orçamento.', 'contato FHD Automação, orçamento automação industrial, telefone Sumaré, endereço FHD', 'https://fhdautomacao.com.br/contato', 'Contato - FHD Automação Industrial', 'Entre em contato com a FHD Automação Industrial. Especialistas em automação hidráulica e pneumática em Sumaré, SP.', 'https://fhdautomacao.com.br/og-image.jpg', 'FHD Automação Industrial', 'Contato - FHD Automação Industrial', 'Entre em contato com a FHD Automação Industrial. Especialistas em automação hidráulica e pneumática em Sumaré, SP.', 'https://fhdautomacao.com.br/og-image.jpg', 'FHD Automação Industrial', '{"@context": "https://schema.org", "@type": "ContactPage", "name": "FHD Automação Industrial", "description": "Página de contato da FHD Automação Industrial"}'),
('clients', 'Nossos Clientes - FHD Automação Industrial', 'Conheça os clientes satisfeitos da FHD Automação Industrial e os projetos de sucesso que realizamos em automação hidráulica e pneumática.', 'clientes, projetos, automação industrial, hidráulica, pneumática, cases de sucesso', 'https://fhdautomacao.com.br/clientes', 'Nossos Clientes - FHD Automação Industrial', 'Conheça os clientes satisfeitos da FHD Automação Industrial e os projetos de sucesso que realizamos.', 'https://fhdautomacao.com.br/og-image.jpg', 'FHD Automação Industrial', 'Nossos Clientes - FHD Automação Industrial', 'Conheça os clientes satisfeitos da FHD Automação Industrial e os projetos de sucesso que realizamos.', 'https://fhdautomacao.com.br/og-image.jpg', 'FHD Automação Industrial', '{"@context": "https://schema.org", "@type": "WebPage", "name": "Nossos Clientes", "description": "Clientes e projetos da FHD Automação Industrial"}'),
('quotation', 'Solicitar Orçamento - FHD Automação Industrial', 'Solicite um orçamento personalizado para seus projetos de automação industrial. FHD Automação Industrial - especialistas em hidráulica e pneumática.', 'orçamento automação, cotação hidráulica, preço pneumática, solicitar proposta, FHD Automação', 'https://fhdautomacao.com.br/orcamento', 'Solicitar Orçamento - FHD Automação Industrial', 'Solicite um orçamento personalizado para seus projetos de automação industrial. FHD Automação Industrial.', 'https://fhdautomacao.com.br/og-image.jpg', 'FHD Automação Industrial', 'Solicitar Orçamento - FHD Automação Industrial', 'Solicite um orçamento personalizado para seus projetos de automação industrial. FHD Automação Industrial.', 'https://fhdautomacao.com.br/og-image.jpg', 'FHD Automação Industrial', '{"@context": "https://schema.org", "@type": "WebPage", "name": "Solicitar Orçamento", "description": "Formulário para solicitação de orçamento"}');
```

## ✅ VERIFICAÇÃO

### **Teste 1: Verificar se a tabela existe**
```sql
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_name = 'seo_settings'
);
```

### **Teste 2: Verificar se a coluna page_name existe**
```sql
SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'seo_settings' 
    AND column_name = 'page_name'
);
```

### **Teste 3: Verificar dados**
```sql
SELECT page_name, title, is_active 
FROM seo_settings 
ORDER BY page_name;
```

## 🧪 TESTE DA API

Execute o script de teste:
```bash
node scripts/test-seo-api.js
```

## 🎯 PRÓXIMOS PASSOS

1. **Execute o script de correção** no Supabase
2. **Verifique se a tabela foi criada** corretamente
3. **Teste a API** com o script fornecido
4. **Acesse o admin panel** e vá para a seção SEO
5. **Configure as políticas RLS** se necessário

## 📞 SUPORTE

Se ainda tiver problemas:
- Verifique os logs do Supabase
- Teste a conexão com o banco
- Verifique as variáveis de ambiente
- Consulte a documentação completa em `docs/resolver-erro-seo.md`

---

**✅ Após resolver o problema, o sistema de SEO estará funcionando perfeitamente!**
