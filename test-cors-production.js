#!/usr/bin/env node

/**
 * Teste de CORS para API de Produção
 * Simula tentativas de acesso não autorizado
 */

const API_URL = 'https://fhdautomacaoindustrialapp.vercel.app/api'

// Testes de origens não permitidas
const maliciousOrigins = [
  'https://malicious-site.com',
  'https://hacker-attempt.com',
  'http://192.168.1.100:3000',
  'https://fake-fhd-site.com',
  'https://evil-domain.org'
]

// Testes de origens permitidas
const allowedOrigins = [
  'https://fhdautomacaoindustrialapp.vercel.app',
  'https://fhdautomacaoindustrialapp.vercel.app/admin',
  'http://localhost:5173'
]

async function testCORS() {
  console.log('🔒 Testando Proteção CORS da API de Produção\n')
  console.log(`🌐 API URL: ${API_URL}\n`)

  // Teste 1: Verificar se a API está respondendo
  console.log('📡 Teste 1: Verificar se a API está respondendo')
  try {
    const response = await fetch(`${API_URL}/health`)
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

  // Teste 2: Tentativas de acesso com origens maliciosas
  console.log('🚫 Teste 2: Tentativas de acesso com origens maliciosas')
  for (const origin of maliciousOrigins) {
    try {
      const response = await fetch(`${API_URL}/seo-settings`, {
        headers: {
          'Origin': origin,
          'Content-Type': 'application/json'
        }
      })

      if (response.status === 403 || response.status === 401) {
        console.log(`✅ ${origin} - BLOQUEADO corretamente (${response.status})`)
      } else if (response.status === 200) {
        console.log(`❌ ${origin} - NÃO foi bloqueado! (${response.status})`)
      } else {
        console.log(`⚠️ ${origin} - Status inesperado: ${response.status}`)
      }
    } catch (error) {
      if (error.message.includes('CORS') || error.message.includes('blocked')) {
        console.log(`✅ ${origin} - BLOQUEADO por CORS`)
      } else {
        console.log(`❌ ${origin} - Erro inesperado: ${error.message}`)
      }
    }
  }
  console.log('')

  // Teste 3: Acesso com origens permitidas
  console.log('✅ Teste 3: Acesso com origens permitidas')
  for (const origin of allowedOrigins) {
    try {
      const response = await fetch(`${API_URL}/seo-settings`, {
        headers: {
          'Origin': origin,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        console.log(`✅ ${origin} - ACESSO PERMITIDO`)
      } else {
        console.log(`⚠️ ${origin} - Status: ${response.status}`)
      }
    } catch (error) {
      console.log(`❌ ${origin} - Erro: ${error.message}`)
    }
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
