# Sistema de Gerenciamento de SEO

## Visão Geral

O sistema de gerenciamento de SEO permite configurar e gerenciar todas as meta tags e otimizações SEO para cada página do site através de uma interface administrativa intuitiva.

## Funcionalidades

### ✅ Configurações Completas de SEO
- **Meta Tags Básicas**: title, description, keywords, author, robots
- **Open Graph (Facebook)**: og:title, og:description, og:image, og:type, og:locale
- **Twitter Cards**: twitter:card, twitter:title, twitter:description, twitter:image
- **Dados Estruturados**: JSON-LD para melhor indexação
- **Configurações Avançadas**: viewport, charset, favicon, canonical URL

### ✅ Interface Administrativa
- Gerenciamento visual de todas as configurações
- Preview em tempo real das meta tags
- Busca e filtros para encontrar configurações
- Editor com abas organizadas (Básico, Redes Sociais, Avançado, Preview)

### ✅ Integração Automática
- Aplicação automática das configurações nas páginas
- Fallback para configurações padrão
- Cache inteligente para performance

## Estrutura do Banco de Dados

### Tabela: `seo_settings`

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

## Instalação

### 1. Aplicar a Migração

Execute o script SQL no seu banco de dados Supabase:

```bash
# Via Supabase CLI
supabase db push

# Ou execute manualmente o arquivo:
# supabase/migrations/20250101000013_create_seo_settings_table.sql
```

### 2. Verificar a Instalação

Execute no SQL Editor do Supabase:

```sql
SELECT 
    'Migração de SEO aplicada com sucesso!' as status,
    COUNT(*) as total_configuracoes,
    COUNT(CASE WHEN is_active = true THEN 1 END) as configuracoes_ativas
FROM seo_settings;
```

## Como Usar

### 1. Acessar o Gerenciador de SEO

1. Faça login na área administrativa
2. Navegue para **Configurações > SEO**
3. Você verá a lista de todas as configurações existentes

### 2. Criar Nova Configuração

1. Clique em **"Nova Configuração"**
2. Preencha o **Nome da Página** (ex: home, about, services)
3. Configure as meta tags nas abas:
   - **Básico**: Título, descrição, palavras-chave, URL canônica
   - **Redes Sociais**: Open Graph e Twitter Cards
   - **Avançado**: Dados estruturados, viewport, charset
   - **Preview**: Visualização das meta tags

### 3. Editar Configuração Existente

1. Clique no ícone de **editar** ao lado da configuração
2. Modifique os campos necessários
3. Use a aba **Preview** para ver como ficará
4. Clique em **Salvar**

### 4. Aplicar nas Páginas

Para usar as configurações dinamicamente nas páginas, importe o componente `DynamicSEO`:

```jsx
import DynamicSEO from '@/components/common/DynamicSEO'

const MinhaPagina = () => {
  return (
    <>
      <DynamicSEO 
        pageName="home" 
        fallbackData={{
          title: "Título Padrão",
          description: "Descrição padrão"
        }}
      />
      {/* Conteúdo da página */}
    </>
  )
}
```

## Configurações Padrão Incluídas

O sistema já vem com configurações pré-definidas para:

- **home**: Página inicial
- **about**: Quem somos
- **services**: Nossos serviços
- **contact**: Contato
- **clients**: Nossos clientes
- **quotation**: Solicitar orçamento

## API Endpoints

### GET `/api/seo-settings`
Buscar configurações de SEO

**Parâmetros:**
- `page_name` (opcional): Nome específico da página
- `id` (opcional): ID específico da configuração

**Resposta:**
```json
{
  "success": true,
  "data": [...],
  "count": 6
}
```

### POST `/api/seo-settings`
Criar nova configuração

**Body:**
```json
{
  "page_name": "nova-pagina",
  "title": "Título da Página",
  "description": "Descrição da página",
  "keywords": "palavra-chave1, palavra-chave2",
  "canonical_url": "https://exemplo.com/pagina",
  "og_title": "Título Open Graph",
  "og_description": "Descrição Open Graph",
  "og_image": "https://exemplo.com/imagem.jpg",
  "og_type": "website",
  "og_site_name": "Nome do Site",
  "og_locale": "pt_BR",
  "twitter_card": "summary_large_image",
  "twitter_title": "Título Twitter",
  "twitter_description": "Descrição Twitter",
  "twitter_image": "https://exemplo.com/imagem-twitter.jpg",
  "structured_data": {...},
  "robots": "index, follow",
  "author": "Autor",
  "viewport": "width=device-width, initial-scale=1.0",
  "charset": "UTF-8",
  "favicon_url": "https://exemplo.com/favicon.ico",
  "is_active": true
}
```

### PUT `/api/seo-settings?id={id}`
Atualizar configuração existente

### DELETE `/api/seo-settings?id={id}`
Deletar configuração

## Melhores Práticas

### 1. Títulos
- Mantenha entre 50-60 caracteres
- Inclua palavras-chave principais
- Seja descritivo e atrativo

### 2. Descrições
- Máximo 160 caracteres
- Inclua call-to-action quando apropriado
- Seja específico sobre o conteúdo da página

### 3. Palavras-chave
- Use 3-5 palavras-chave relevantes
- Separe por vírgulas
- Evite keyword stuffing

### 4. Open Graph
- Use imagens de 1200x630px para melhor visualização
- Títulos diferentes do title principal quando apropriado
- Descrições mais detalhadas para redes sociais

### 5. Dados Estruturados
- Use JSON-LD válido
- Inclua informações da empresa (Organization)
- Adicione dados específicos para cada tipo de página

## Troubleshooting

### Problema: Configurações não aparecem
**Solução:** Verifique se a API está funcionando e se as configurações estão ativas (`is_active = true`)

### Problema: Meta tags não são aplicadas
**Solução:** Verifique se o componente `DynamicSEO` está sendo usado corretamente na página

### Problema: Preview não funciona
**Solução:** Verifique se todos os campos obrigatórios estão preenchidos

### Problema: Erro ao salvar
**Solução:** Verifique se o `page_name` é único e se todos os campos obrigatórios estão preenchidos

## Monitoramento

### Verificar Configurações Ativas
```sql
SELECT page_name, title, is_active, updated_at 
FROM seo_settings 
WHERE is_active = true 
ORDER BY page_name;
```

### Verificar Configurações Recentes
```sql
SELECT page_name, title, updated_at 
FROM seo_settings 
ORDER BY updated_at DESC 
LIMIT 10;
```

## Suporte

Para dúvidas ou problemas:
1. Verifique os logs do console do navegador
2. Teste a API diretamente via Postman/Insomnia
3. Verifique se a migração foi aplicada corretamente
4. Consulte a documentação do Supabase para problemas de banco

## Próximas Melhorias

- [ ] Cache de configurações para melhor performance
- [ ] Validação automática de meta tags
- [ ] Integração com Google Search Console
- [ ] Relatórios de performance SEO
- [ ] Bulk edit de configurações
- [ ] Templates de configuração
- [ ] Versionamento de configurações
