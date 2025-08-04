import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yvbombdbcdyappuziwgx.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2Ym9tYmRiY2R5YXBwdXppd2d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNjM1OTcsImV4cCI6MjA2OTczOTU5N30.ecTlDkcXE0GAYYSfaz_oci0QqqH1vmIKbue1TBUV8n8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

