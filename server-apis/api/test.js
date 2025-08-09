export default async function handler(req, res) {
  return res.status(200).json({
    message: 'API funcionando',
    timestamp: new Date().toISOString(),
    env: {
      hasSupabaseUrl: !!(process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL),
      hasSupabaseKey: !!(process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY),
    }
  })
}
