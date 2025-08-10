#!/usr/bin/env node

/**
 * Teste do Sistema JWT de Autenticação
 * Testa login, verificação e renovação de tokens
 */

const API_URL = 'https://fhdautomacaoindustrialapp.vercel.app/api'

async function testJWTAuth() {
  console.log('🔐 Testando Sistema JWT de Autenticação\n')
  console.log(`🌐 API URL: ${API_URL}\n`)

  let authToken = null

  // Teste 1: Login
  console.log('📝 Teste 1: Login')
  try {
    const response = await fetch(`${API_URL}/auth?action=login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://fhdautomacaoindustrialapp.vercel.app'
      },
      body: JSON.stringify({
        email: 'adminfhd@fhd.com',
        password: 'FhdAuto6526@'
      })
    })

    const data = await response.json()
    console.log(`Status: ${response.status}`)

    if (response.ok && data.success) {
      authToken = data.data.token
      console.log('✅ Login bem-sucedido')
      console.log(`👤 Usuário: ${data.data.user.name}`)
      console.log(`📧 Email: ${data.data.user.email}`)
      console.log(`🔑 Token: ${authToken.substring(0, 20)}...`)
      console.log(`⏰ Expira em: ${data.data.expiresAt}`)
    } else {
      console.log('❌ Login falhou:', data.error)
      return
    }
  } catch (error) {
    console.log('❌ Erro no login:', error.message)
    return
  }
  console.log('')

  // Teste 2: Verificar token
  console.log('🔍 Teste 2: Verificar token')
  try {
    const response = await fetch(`${API_URL}/auth?action=verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        'Origin': 'https://fhdautomacaoindustrialapp.vercel.app'
      }
    })

    const data = await response.json()
    console.log(`Status: ${response.status}`)

    if (response.ok && data.success) {
      console.log('✅ Token verificado com sucesso')
      console.log(`👤 Usuário: ${data.data.user.name}`)
      console.log(`✅ Válido: ${data.data.valid}`)
    } else {
      console.log('❌ Verificação falhou:', data.error)
    }
  } catch (error) {
    console.log('❌ Erro na verificação:', error.message)
  }
  console.log('')

  // Teste 3: Renovar token
  console.log('🔄 Teste 3: Renovar token')
  try {
    const response = await fetch(`${API_URL}/auth?action=refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        'Origin': 'https://fhdautomacaoindustrialapp.vercel.app'
      }
    })

    const data = await response.json()
    console.log(`Status: ${response.status}`)

    if (response.ok && data.success) {
      const newToken = data.data.token
      console.log('✅ Token renovado com sucesso')
      console.log(`🔑 Novo token: ${newToken.substring(0, 20)}...`)
      console.log(`⏰ Nova expiração: ${data.data.expiresAt}`)
      authToken = newToken
    } else {
      console.log('❌ Renovação falhou:', data.error)
    }
  } catch (error) {
    console.log('❌ Erro na renovação:', error.message)
  }
  console.log('')

  // Teste 4: Tentativa de acesso com token inválido
  console.log('🚫 Teste 4: Tentativa com token inválido')
  try {
    const response = await fetch(`${API_URL}/auth?action=verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer token_invalido_123',
        'Origin': 'https://fhdautomacaoindustrialapp.vercel.app'
      }
    })

    const data = await response.json()
    console.log(`Status: ${response.status}`)

    if (response.status === 401) {
      console.log('✅ Token inválido rejeitado corretamente')
    } else {
      console.log('❌ Token inválido não foi rejeitado')
    }
  } catch (error) {
    console.log('❌ Erro no teste de token inválido:', error.message)
  }
  console.log('')

  // Teste 5: Tentativa de login com credenciais inválidas
  console.log('🚫 Teste 5: Login com credenciais inválidas')
  try {
    const response = await fetch(`${API_URL}/auth?action=login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://fhdautomacaoindustrialapp.vercel.app'
      },
      body: JSON.stringify({
        email: 'adminfhd@fhd.com',
        password: 'senha_errada'
      })
    })

    const data = await response.json()
    console.log(`Status: ${response.status}`)

    if (response.status === 401) {
      console.log('✅ Credenciais inválidas rejeitadas corretamente')
    } else {
      console.log('❌ Credenciais inválidas não foram rejeitadas')
    }
  } catch (error) {
    console.log('❌ Erro no teste de credenciais inválidas:', error.message)
  }
  console.log('')

  console.log('🎉 Testes JWT concluídos!')
}

// Executar testes
testJWTAuth().catch(console.error)
