-- Preferências de visibilidade do menu lateral por usuário
CREATE TABLE IF NOT EXISTS public.user_menu_prefs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  section_id varchar NOT NULL,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_user_section UNIQUE (user_id, section_id)
);

-- RLS
ALTER TABLE public.user_menu_prefs ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "menu_prefs_insert" ON public.user_menu_prefs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "menu_prefs_select" ON public.user_menu_prefs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "menu_prefs_update" ON public.user_menu_prefs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "menu_prefs_delete" ON public.user_menu_prefs
  FOR DELETE USING (auth.uid() = user_id);


