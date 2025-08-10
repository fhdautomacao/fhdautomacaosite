// Teste da API de autenticação
async function testAuthAPI() {
  console.log('🧪 Testando API de autenticação...')
  
  const API_BASE_URL = 'https://fhdautomacaoindustrialapp.vercel.app'
  
  try {
    // Teste 1: Simular exatamente como o frontend chama a API
    console.log('🔐 Testando login como o frontend...')
    const loginResponse = await fetch(`${API_BASE_URL}/api/auth?action=login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://fhdautomacaoindustrialapp.vercel.app'
      },
      body: JSON.stringify({ 
        email: 'adminfhd@fhd.com', 
        password: 'test123' 
      })
    })
    
    console.log('📡 Resposta do login:', {
      status: loginResponse.status,
      ok: loginResponse.ok,
      statusText: loginResponse.statusText
    })
    
    // Verificar Content-Type
    const contentType = loginResponse.headers.get('content-type')
    console.log('📄 Content-Type da resposta:', contentType)
    
    const loginText = await loginResponse.text()
    console.log('📄 Resposta do login (bruta):', loginText)
    
    try {
      const loginData = JSON.parse(loginText)
      console.log('📄 Resposta do login (JSON):', loginData)
    } catch (parseError) {
      console.error('❌ Erro ao fazer parse do login:', parseError)
      console.log('📄 Conteúdo da resposta do login:', loginText)
    }
    
    // Teste 2: Verificar se a API está retornando HTML em vez de JSON
    if (loginText.includes('<html>') || loginText.includes('<!DOCTYPE')) {
      console.error('❌ A API está retornando HTML em vez de JSON!')
      console.log('📄 Primeiros 500 caracteres:', loginText.substring(0, 500))
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error)
  }
}

// Executar teste
testAuthAPI()
