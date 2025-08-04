-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.about_content (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title character varying NOT NULL,
  subtitle character varying,
  description text,
  mission text,
  vision text,
  values jsonb,
  team_description text,
  image_url text,
  is_visible boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT about_content_pkey PRIMARY KEY (id)
);
CREATE TABLE public.activity_logs (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  action character varying NOT NULL,
  table_name character varying,
  record_id uuid,
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT activity_logs_pkey PRIMARY KEY (id),
  CONSTRAINT activity_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.categories (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  description text,
  icon character varying,
  color character varying,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT categories_pkey PRIMARY KEY (id)
);
CREATE TABLE public.clients (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  industry character varying,
  logo_url text,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT clients_pkey PRIMARY KEY (id)
);
CREATE TABLE public.contact_info (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  phone character varying,
  email character varying,
  address text,
  working_hours text,
  emergency_phone character varying,
  whatsapp character varying,
  social_media jsonb,
  map_embed_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT contact_info_pkey PRIMARY KEY (id)
);
CREATE TABLE public.contact_messages (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  company character varying,
  email character varying NOT NULL,
  phone character varying,
  service_of_interest character varying,
  message text,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT contact_messages_pkey PRIMARY KEY (id)
);
CREATE TABLE public.gallery_items (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title character varying NOT NULL,
  description text,
  category character varying,
  image_url text,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT gallery_items_pkey PRIMARY KEY (id)
);
CREATE TABLE public.hero_content (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title character varying NOT NULL,
  subtitle character varying,
  description text,
  cta_text character varying,
  cta_link character varying,
  secondary_cta_text character varying,
  secondary_cta_link character varying,
  background_image_url text,
  is_visible boolean DEFAULT true,
  show_stats boolean DEFAULT true,
  show_features boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT hero_content_pkey PRIMARY KEY (id)
);
CREATE TABLE public.hero_features (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  hero_id uuid,
  icon character varying,
  title character varying NOT NULL,
  description character varying,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT hero_features_pkey PRIMARY KEY (id),
  CONSTRAINT hero_features_hero_id_fkey FOREIGN KEY (hero_id) REFERENCES public.hero_content(id)
);
CREATE TABLE public.hero_stats (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  hero_id uuid,
  stat_key character varying NOT NULL,
  value character varying NOT NULL,
  label character varying NOT NULL,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT hero_stats_pkey PRIMARY KEY (id),
  CONSTRAINT hero_stats_hero_id_fkey FOREIGN KEY (hero_id) REFERENCES public.hero_content(id)
);
CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  description text,
  category character varying,
  image_url text,
  features jsonb,
  price character varying,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT products_pkey PRIMARY KEY (id)
);
CREATE TABLE public.seo_settings (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  page_path character varying NOT NULL UNIQUE,
  title character varying,
  description text,
  keywords text,
  og_title character varying,
  og_description text,
  og_image_url text,
  canonical_url character varying,
  robots character varying DEFAULT 'index,follow'::character varying,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT seo_settings_pkey PRIMARY KEY (id)
);
CREATE TABLE public.services (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  description text,
  icon character varying,
  category character varying,
  price character varying,
  features jsonb,
  image_url text,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT services_pkey PRIMARY KEY (id)
);
CREATE TABLE public.site_settings (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  setting_key character varying NOT NULL UNIQUE,
  setting_value text,
  setting_type character varying DEFAULT 'text'::character varying,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT site_settings_pkey PRIMARY KEY (id)
);
CREATE TABLE public.testimonials (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  company character varying,
  position character varying,
  text text NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  avatar_url text,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT testimonials_pkey PRIMARY KEY (id)
);
CREATE TABLE public.users (
  id uuid NOT NULL,
  email character varying NOT NULL UNIQUE,
  role character varying DEFAULT 'user'::character varying,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);