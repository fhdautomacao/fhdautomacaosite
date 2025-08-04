-- Enable uuid-ossp extension for uuid_generate_v4()
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela para produtos
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(255),
  image_url TEXT,
  features JSONB,
  price VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para galeria
CREATE TABLE gallery_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(255),
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para clientes
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  industry VARCHAR(255),
  logo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para mensagens de contato
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(255),
  service_of_interest VARCHAR(255),
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para usuários
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para conteúdo da seção Hero
CREATE TABLE hero_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  description TEXT,
  cta_text VARCHAR(100),
  cta_link VARCHAR(255),
  secondary_cta_text VARCHAR(100),
  secondary_cta_link VARCHAR(255),
  background_image_url TEXT,
  is_visible BOOLEAN DEFAULT true,
  show_stats BOOLEAN DEFAULT true,
  show_features BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para estatísticas do Hero
CREATE TABLE hero_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hero_id UUID REFERENCES hero_content(id) ON DELETE CASCADE,
  stat_key VARCHAR(50) NOT NULL,
  value VARCHAR(50) NOT NULL,
  label VARCHAR(100) NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para características do Hero
CREATE TABLE hero_features (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hero_id UUID REFERENCES hero_content(id) ON DELETE CASCADE,
  icon VARCHAR(10),
  title VARCHAR(100) NOT NULL,
  description VARCHAR(255),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para serviços
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(10),
  category VARCHAR(100),
  price VARCHAR(100),
  features JSONB,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para conteúdo da seção Sobre
CREATE TABLE about_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  description TEXT,
  mission TEXT,
  vision TEXT,
  values JSONB,
  team_description TEXT,
  image_url TEXT,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para informações de contato
CREATE TABLE contact_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone VARCHAR(50),
  email VARCHAR(255),
  address TEXT,
  working_hours TEXT,
  emergency_phone VARCHAR(50),
  whatsapp VARCHAR(50),
  social_media JSONB,
  map_embed_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para depoimentos
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  position VARCHAR(255),
  text TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para configurações de SEO
CREATE TABLE seo_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_path VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255),
  description TEXT,
  keywords TEXT,
  og_title VARCHAR(255),
  og_description TEXT,
  og_image_url TEXT,
  canonical_url VARCHAR(255),
  robots VARCHAR(100) DEFAULT 'index,follow',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para categorias
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(10),
  color VARCHAR(7),
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para configurações gerais do site
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  setting_type VARCHAR(50) DEFAULT 'text',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para logs de atividades
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  table_name VARCHAR(100),
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS para products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public products are viewable by everyone." ON products FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated users can insert products." ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update products." ON products FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete products." ON products FOR DELETE USING (auth.role() = 'authenticated');

-- RLS para gallery_items table
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public gallery items are viewable by everyone." ON gallery_items FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated users can insert gallery items." ON gallery_items FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update gallery items." ON gallery_items FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete gallery items." ON gallery_items FOR DELETE USING (auth.role() = 'authenticated');

-- RLS para clients table
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public clients are viewable by everyone." ON clients FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated users can insert clients." ON clients FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update clients." ON clients FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete clients." ON clients FOR DELETE USING (auth.role() = 'authenticated');

-- RLS para contact_messages table
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert contact messages." ON contact_messages FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admin users can view all contact messages." ON contact_messages FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin users can update contact messages." ON contact_messages FOR UPDATE USING (auth.role() = 'authenticated');

-- RLS para users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own data." ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admin users can view all user data." ON users FOR SELECT USING (auth.role() = 'authenticated');

-- RLS para hero_content table
ALTER TABLE hero_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public hero content is viewable by everyone." ON hero_content FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated users can manage hero content." ON hero_content FOR ALL USING (auth.role() = 'authenticated');

-- RLS para hero_stats table
ALTER TABLE hero_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public hero stats are viewable by everyone." ON hero_stats FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated users can manage hero stats." ON hero_stats FOR ALL USING (auth.role() = 'authenticated');

-- RLS para hero_features table
ALTER TABLE hero_features ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public hero features are viewable by everyone." ON hero_features FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated users can manage hero features." ON hero_features FOR ALL USING (auth.role() = 'authenticated');

-- RLS para services table
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public services are viewable by everyone." ON services FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated users can manage services." ON services FOR ALL USING (auth.role() = 'authenticated');

-- RLS para about_content table
ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public about content is viewable by everyone." ON about_content FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated users can manage about content." ON about_content FOR ALL USING (auth.role() = 'authenticated');

-- RLS para contact_info table
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public contact info is viewable by everyone." ON contact_info FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated users can manage contact info." ON contact_info FOR ALL USING (auth.role() = 'authenticated');

-- RLS para testimonials table
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public testimonials are viewable by everyone." ON testimonials FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated users can manage testimonials." ON testimonials FOR ALL USING (auth.role() = 'authenticated');

-- RLS para seo_settings table
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public SEO settings are viewable by everyone." ON seo_settings FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated users can manage SEO settings." ON seo_settings FOR ALL USING (auth.role() = 'authenticated');

-- RLS para categories table
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public categories are viewable by everyone." ON categories FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated users can manage categories." ON categories FOR ALL USING (auth.role() = 'authenticated');

-- RLS para site_settings table
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public site settings are viewable by everyone." ON site_settings FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated users can manage site settings." ON site_settings FOR ALL USING (auth.role() = 'authenticated');

-- RLS para activity_logs table
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin users can view activity logs." ON activity_logs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "System can insert activity logs." ON activity_logs FOR INSERT WITH CHECK (TRUE);

-- Inserir dados iniciais para hero_content
INSERT INTO hero_content (title, subtitle, description, cta_text, cta_link, secondary_cta_text, secondary_cta_link, show_stats, show_features) VALUES 
('Automação', 'Hidráulica e Pneumática', 'Transformamos desafios industriais em soluções eficientes com mais de 10 anos de experiência e tecnologia de ponta.', 'Solicitar Orçamento', '/contato', 'Nossos Serviços', '/servicos', true, true);

-- Inserir dados iniciais para contact_info
INSERT INTO contact_info (phone, email, address, working_hours, emergency_phone, whatsapp) VALUES 
('(19) 99865-2144', 'comercial@fhdautomacao.com.br', 'R. João Ediberti Biondo, 336, Jd. Res. Ravagnani, Sumaré - SP, 13171-446', 'Segunda a Sexta: 8h às 18h, Sábado: 8h às 12h, Domingo: Fechado', '(19) 99865-2144', '(19) 99865-2144');

-- Inserir configurações SEO iniciais
INSERT INTO seo_settings (page_path, title, description, keywords) VALUES 
('/', 'FHD Automação Industrial - Soluções Hidráulicas e Pneumáticas', 'Especialistas em automação hidráulica e pneumática. Mais de 10 anos de experiência em soluções industriais personalizadas.', 'automação hidráulica, pneumática, cilindros, bombas, válvulas, unidades hidráulicas'),
('/quem-somos', 'Quem Somos - FHD Automação Industrial', 'Conheça a FHD Automação Industrial, empresa especializada em soluções hidráulicas e pneumáticas com mais de 10 anos de experiência.', 'sobre nós, empresa, automação industrial, experiência'),
('/servicos', 'Nossos Serviços - FHD Automação Industrial', 'Conheça todos os serviços oferecidos pela FHD Automação: projetos, manutenção, fabricação e muito mais.', 'serviços, projetos hidráulicos, manutenção, fabricação'),
('/contato', 'Contato - FHD Automação Industrial', 'Entre em contato com a FHD Automação Industrial. Estamos prontos para atender suas necessidades.', 'contato, orçamento, telefone, email');

-- Criar índices para melhor performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_gallery_category ON gallery_items(category);
CREATE INDEX idx_gallery_active ON gallery_items(is_active);
CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_services_active ON services(is_active);
CREATE INDEX idx_contact_messages_created ON contact_messages(created_at);
CREATE INDEX idx_activity_logs_created ON activity_logs(created_at);
CREATE INDEX idx_seo_settings_path ON seo_settings(page_path);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gallery_items_updated_at BEFORE UPDATE ON gallery_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hero_content_updated_at BEFORE UPDATE ON hero_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hero_stats_updated_at BEFORE UPDATE ON hero_stats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hero_features_updated_at BEFORE UPDATE ON hero_features FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_about_content_updated_at BEFORE UPDATE ON about_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contact_info_updated_at BEFORE UPDATE ON contact_info FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_seo_settings_updated_at BEFORE UPDATE ON seo_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

