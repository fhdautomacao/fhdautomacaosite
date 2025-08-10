// Teste para debugar o problema de autenticação
const API_BASE_URL = 'https://fhdautomacaoindustrialapp.vercel.app/api'

async function testAuthAPI() {
  console.log('🧪 Testando API de autenticação...')
  
  // Teste 1: Verificar se a API está acessível
  try {
    console.log('📡 Testando conectividade com a API...')
    const response = await fetch(`${API_BASE_URL}/auth?action=verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer invalid-token',
        'Origin': 'https://fhdautomacaoindustrialapp.vercel.app'
      }
    })
    
    console.log('✅ API acessível:', {
      status: response.status,
      ok: response.ok
    })
    
    const data = await response.json()
    console.log('📄 Resposta:', data)
    
  } catch (error) {
    console.error('❌ Erro ao acessar API:', error)
  }
  
  // Teste 2: Verificar localStorage
  console.log('📦 Verificando localStorage...')
  const storedToken = localStorage.getItem('jwt_token')
  const storedUser = localStorage.getItem('jwt_user')
  const storedExpiresAt = localStorage.getItem('jwt_expires_at')
  
  console.log('📦 Dados do localStorage:', {
    hasToken: !!storedToken,
    hasUser: !!storedUser,
    hasExpiresAt: !!storedExpiresAt,
    tokenLength: storedToken ? storedToken.length : 0
  })
  
  if (storedToken && storedUser && storedExpiresAt) {
    const userData = JSON.parse(storedUser)
    const expiryDate = new Date(storedExpiresAt)
    
    console.log('👤 Dados do usuário:', {
      userId: userData.id,
      email: userData.email,
      expiryDate: expiryDate.toISOString(),
      now: new Date().toISOString(),
      isExpired: new Date() > expiryDate
    })
    
    // Teste 3: Verificar token válido
    try {
      console.log('🔍 Testando token válido...')
      const response = await fetch(`${API_BASE_URL}/auth?action=verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedToken}`,
          'Origin': 'https://fhdautomacaoindustrialapp.vercel.app'
        }
      })
      
      console.log('📡 Resposta da verificação:', {
        status: response.status,
        ok: response.ok
      })
      
      const data = await response.json()
      console.log('📄 Dados da resposta:', data)
      
    } catch (error) {
      console.error('❌ Erro ao verificar token:', error)
    }
  }
}

// Executar teste
testAuthAPI()
