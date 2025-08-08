-- Script para dropar e recriar a tabela seo_settings
-- Execute este script no SQL Editor do Supabase

-- 1. Dropar a tabela existente (se existir)
DROP TABLE IF EXISTS seo_settings CASCADE;

-- 2. Criar a tabela novamente com a estrutura correta
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

-- 3. Criar índices
CREATE INDEX idx_seo_settings_page_name ON seo_settings(page_name);
CREATE INDEX idx_seo_settings_active ON seo_settings(is_active);

-- 4. Criar trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_seo_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_seo_settings_updated_at
    BEFORE UPDATE ON seo_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_seo_settings_updated_at();

-- 5. Inserir dados padrão
INSERT INTO seo_settings (page_name, title, description, keywords, canonical_url, og_title, og_description, og_image, og_site_name, twitter_title, twitter_description, twitter_image, author, structured_data) VALUES
(
    'home',
    'FHD Automação Industrial - Soluções Hidráulicas e Pneumáticas',
    'FHD Automação Industrial oferece soluções completas em automação hidráulica e pneumática. Mais de 10 anos de experiência, 500+ projetos realizados e 98% de satisfação dos clientes.',
    'automação industrial, hidráulica, pneumática, cilindros hidráulicos, bombas hidráulicas, válvulas, unidades hidráulicas, manutenção industrial, Sumaré, São Paulo',
    'https://fhdautomacao.com.br',
    'FHD Automação Industrial - Soluções Hidráulicas e Pneumáticas',
    'Especialistas em automação industrial com mais de 10 anos de experiência. Oferecemos soluções completas para suas necessidades hidráulicas e pneumáticas.',
    'https://fhdautomacao.com.br/og-image.jpg',
    'FHD Automação Industrial',
    'FHD Automação Industrial - Soluções Hidráulicas e Pneumáticas',
    'Especialistas em automação industrial com mais de 10 anos de experiência. Oferecemos soluções completas para suas necessidades hidráulicas e pneumáticas.',
    'https://fhdautomacao.com.br/og-image.jpg',
    'FHD Automação Industrial',
    '{"@context": "https://schema.org", "@type": "Organization", "name": "FHD Automação Industrial", "description": "Especialistas em automação industrial, hidráulica e pneumática", "url": "https://fhdautomacao.com.br", "logo": "https://fhdautomacao.com.br/logo.png", "contactPoint": {"@type": "ContactPoint", "telephone": "+55-19-99865-2144", "contactType": "customer service", "email": "comercial@fhdautomacao.com.br"}, "address": {"@type": "PostalAddress", "streetAddress": "R. João Ediberti Biondo, 336", "addressLocality": "Sumaré", "addressRegion": "SP", "postalCode": "13171-446", "addressCountry": "BR"}, "sameAs": ["https://www.linkedin.com/company/fhd-automacao", "https://www.instagram.com/fhdautomacao"]}'
),
(
    'about',
    'Quem Somos - FHD Automação Industrial',
    'Conheça a história da FHD Automação Industrial. Mais de 10 anos de experiência em soluções hidráulicas e pneumáticas, com sede em Sumaré, SP.',
    'sobre FHD Automação, história empresa, automação industrial Sumaré, missão visão valores, equipe especializada',
    'https://fhdautomacao.com.br/quem-somos',
    'Quem Somos - FHD Automação Industrial',
    'Conheça a história da FHD Automação Industrial. Mais de 10 anos de experiência em soluções hidráulicas e pneumáticas.',
    'https://fhdautomacao.com.br/og-image.jpg',
    'FHD Automação Industrial',
    'Quem Somos - FHD Automação Industrial',
    'Conheça a história da FHD Automação Industrial. Mais de 10 anos de experiência em soluções hidráulicas e pneumáticas.',
    'https://fhdautomacao.com.br/og-image.jpg',
    'FHD Automação Industrial',
    '{"@context": "https://schema.org", "@type": "Organization", "name": "FHD Automação Industrial", "description": "Especialistas em automação industrial, hidráulica e pneumática", "url": "https://fhdautomacao.com.br", "logo": "https://fhdautomacao.com.br/logo.png"}'
),
(
    'services',
    'Nossos Serviços - FHD Automação Industrial',
    'Conheça todos os serviços da FHD Automação Industrial: automação hidráulica e pneumática, projetos personalizados, manutenção especializada e muito mais.',
    'serviços automação industrial, manutenção hidráulica, projetos pneumáticos, instalação tubulações, fabricação unidades hidráulicas',
    'https://fhdautomacao.com.br/servicos',
    'Nossos Serviços - FHD Automação Industrial',
    'Conheça todos os serviços da FHD Automação Industrial: automação hidráulica e pneumática, projetos personalizados, manutenção especializada.',
    'https://fhdautomacao.com.br/og-image.jpg',
    'FHD Automação Industrial',
    'Nossos Serviços - FHD Automação Industrial',
    'Conheça todos os serviços da FHD Automação Industrial: automação hidráulica e pneumática, projetos personalizados, manutenção especializada.',
    'https://fhdautomacao.com.br/og-image.jpg',
    'FHD Automação Industrial',
    '{"@context": "https://schema.org", "@type": "Service", "name": "FHD Automação Industrial", "description": "Serviços de automação industrial, hidráulica e pneumática", "provider": {"@type": "Organization", "name": "FHD Automação Industrial"}}'
),
(
    'contact',
    'Contato - FHD Automação Industrial',
    'Entre em contato com a FHD Automação Industrial. Especialistas em automação hidráulica e pneumática em Sumaré, SP. Solicite um orçamento.',
    'contato FHD Automação, orçamento automação industrial, telefone Sumaré, endereço FHD',
    'https://fhdautomacao.com.br/contato',
    'Contato - FHD Automação Industrial',
    'Entre em contato com a FHD Automação Industrial. Especialistas em automação hidráulica e pneumática em Sumaré, SP.',
    'https://fhdautomacao.com.br/og-image.jpg',
    'FHD Automação Industrial',
    'Contato - FHD Automação Industrial',
    'Entre em contato com a FHD Automação Industrial. Especialistas em automação hidráulica e pneumática em Sumaré, SP.',
    'https://fhdautomacao.com.br/og-image.jpg',
    'FHD Automação Industrial',
    '{"@context": "https://schema.org", "@type": "ContactPage", "name": "FHD Automação Industrial", "description": "Página de contato da FHD Automação Industrial"}'
),
(
    'clients',
    'Nossos Clientes - FHD Automação Industrial',
    'Conheça os clientes satisfeitos da FHD Automação Industrial e os projetos de sucesso que realizamos em automação hidráulica e pneumática.',
    'clientes, projetos, automação industrial, hidráulica, pneumática, cases de sucesso',
    'https://fhdautomacao.com.br/clientes',
    'Nossos Clientes - FHD Automação Industrial',
    'Conheça os clientes satisfeitos da FHD Automação Industrial e os projetos de sucesso que realizamos.',
    'https://fhdautomacao.com.br/og-image.jpg',
    'FHD Automação Industrial',
    'Nossos Clientes - FHD Automação Industrial',
    'Conheça os clientes satisfeitos da FHD Automação Industrial e os projetos de sucesso que realizamos.',
    'https://fhdautomacao.com.br/og-image.jpg',
    'FHD Automação Industrial',
    '{"@context": "https://schema.org", "@type": "WebPage", "name": "Nossos Clientes", "description": "Clientes e projetos da FHD Automação Industrial"}'
),
(
    'quotation',
    'Solicitar Orçamento - FHD Automação Industrial',
    'Solicite um orçamento personalizado para seus projetos de automação industrial. FHD Automação Industrial - especialistas em hidráulica e pneumática.',
    'orçamento automação, cotação hidráulica, preço pneumática, solicitar proposta, FHD Automação',
    'https://fhdautomacao.com.br/orcamento',
    'Solicitar Orçamento - FHD Automação Industrial',
    'Solicite um orçamento personalizado para seus projetos de automação industrial. FHD Automação Industrial.',
    'https://fhdautomacao.com.br/og-image.jpg',
    'FHD Automação Industrial',
    'Solicitar Orçamento - FHD Automação Industrial',
    'Solicite um orçamento personalizado para seus projetos de automação industrial. FHD Automação Industrial.',
    'https://fhdautomacao.com.br/og-image.jpg',
    'FHD Automação Industrial',
    '{"@context": "https://schema.org", "@type": "WebPage", "name": "Solicitar Orçamento", "description": "Formulário para solicitação de orçamento"}'
);

-- 6. Verificar resultado
SELECT 
    'Tabela seo_settings recriada com sucesso!' as status,
    COUNT(*) as total_configuracoes,
    COUNT(CASE WHEN is_active = true THEN 1 END) as configuracoes_ativas,
    STRING_AGG(page_name, ', ' ORDER BY page_name) as paginas_configuradas
FROM seo_settings;
