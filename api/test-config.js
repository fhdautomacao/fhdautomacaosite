export default async function handler(req, res) {
  console.log('🧪 [TEST] Endpoint de teste de configuração chamado')
  
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    // Verificar variáveis de ambiente
    const config = {
      // Supabase
      hasSupabaseUrl: !!(process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL),
      hasSupabaseKey: !!(process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY),
      supabaseUrl: process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
      
      // JWT
      hasJwtSecret: !!process.env.JWT_SECRET,
      jwtSecretLength: process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0,
      
      // App
      hasAppUrl: !!process.env.NEXT_PUBLIC_APP_URL,
      appUrl: process.env.NEXT_PUBLIC_APP_URL,
      
      // API
      hasApiUrl: !!process.env.NEXT_PUBLIC_API_URL,
      apiUrl: process.env.NEXT_PUBLIC_API_URL,
      
      // CORS
      hasAllowedOrigins: !!process.env.ALLOWED_ORIGINS,
      allowedOrigins: process.env.ALLOWED_ORIGINS,
      
      // Ambiente
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV,
      
      // Todas as variáveis disponíveis
      allEnvVars: Object.keys(process.env).filter(key => 
        key.includes('SUPABASE') || 
        key.includes('JWT') || 
        key.includes('APP') || 
        key.includes('API') ||
        key.includes('CORS') ||
        key.includes('ALLOWED')
      )
    }

    console.log('🔧 [TEST] Configuração:', config)

    return res.status(200).json({
      success: true,
      message: 'Teste de configuração',
      config,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ [TEST] Erro no teste:', error)
    return res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    })
  }
}
