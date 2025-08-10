import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('🔧 Supabase Config:', {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  url: supabaseUrl ? 'Configurado' : 'Não configurado',
  keyLength: supabaseAnonKey ? supabaseAnonKey.length : 0
})

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

