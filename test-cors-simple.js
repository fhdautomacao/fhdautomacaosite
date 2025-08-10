#!/usr/bin/env node

/**
 * Teste Simples de CORS para API de Produção
 * Simula tentativas de acesso não autorizado
 */

const API_URL = 'https://fhdautomacaoindustrialapp.vercel.app/api'

async function testCORS() {
  console.log('🔒 Testando Proteção CORS da API de Produção\n')
  console.log(`🌐 API URL: ${API_URL}\n`)

  // Teste 1: Verificar se a API está respondendo
  console.log('📡 Teste 1: Verificar se a API está respondendo')
  try {
    const response = await fetch(`${API_URL}/health`)
    console.log(`Status: ${response.status}`)
    if (response.ok) {
      const data = await response.json()
      console.log('✅ API está respondendo:', data.message || 'OK')
    } else {
      console.log('❌ API não está respondendo corretamente')
      return
    }
  } catch (error) {
    console.log('❌ Erro ao conectar com a API:', error.message)
    return
  }
  console.log('')

  // Teste 2: Tentativa de acesso com origem maliciosa
  console.log('🚫 Teste 2: Tentativa de acesso com origem maliciosa')
  try {
    const response = await fetch(`${API_URL}/seo-settings`, {
      headers: {
        'Origin': 'https://malicious-site.com',
        'Content-Type': 'application/json'
      }
    })

    if (response.status === 403 || response.status === 401) {
      console.log(`✅ Origem maliciosa BLOQUEADA corretamente (${response.status})`)
    } else if (response.status === 200) {
      console.log(`❌ Origem maliciosa NÃO foi bloqueada! (${response.status})`)
    } else {
      console.log(`⚠️ Status inesperado: ${response.status}`)
    }
  } catch (error) {
    if (error.message.includes('CORS') || error.message.includes('blocked')) {
      console.log('✅ Origem maliciosa BLOQUEADA por CORS')
    } else {
      console.log(`❌ Erro inesperado: ${error.message}`)
    }
  }
  console.log('')

  // Teste 3: Acesso com origem permitida
  console.log('✅ Teste 3: Acesso com origem permitida')
  try {
    const response = await fetch(`${API_URL}/seo-settings`, {
      headers: {
        'Origin': 'https://fhdautomacaoindustrialapp.vercel.app',
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      console.log('✅ Origem permitida - ACESSO AUTORIZADO')
    } else {
      console.log(`⚠️ Origem permitida - Status: ${response.status}`)
    }
  } catch (error) {
    console.log(`❌ Erro com origem permitida: ${error.message}`)
  }
  console.log('')

  // Teste 4: Tentativa de acesso admin sem autenticação
  console.log('🔐 Teste 4: Tentativa de acesso admin sem autenticação')
  try {
    const response = await fetch(`${API_URL}/seo-settings`, {
      method: 'POST',
      headers: {
        'Origin': 'https://fhdautomacaoindustrialapp.vercel.app',
        'Content-Type': 'application/json',
        'X-Admin-Request': 'true' // Simula requisição admin
      },
      body: JSON.stringify({
        page_name: 'test-page',
        title: 'Test Page'
      })
    })

    if (response.status === 401) {
      console.log('✅ Acesso admin sem autenticação - BLOQUEADO corretamente')
    } else {
      console.log(`⚠️ Acesso admin sem autenticação - Status: ${response.status}`)
    }
  } catch (error) {
    console.log(`❌ Erro no teste admin: ${error.message}`)
  }
  console.log('')

  console.log('🎉 Testes de CORS concluídos!')
}

// Executar testes
testCORS().catch(console.error)
