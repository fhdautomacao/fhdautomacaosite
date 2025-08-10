#!/usr/bin/env node

/**
 * Teste Direto de CORS para API de Produção
 * Testa a proteção CORS diretamente
 */

const API_URL = 'https://fhdautomacaoindustrialapp.vercel.app/api'

async function testCORS() {
  console.log('🔒 Testando Proteção CORS da API de Produção\n')
  console.log(`🌐 API URL: ${API_URL}\n`)

  // Teste 1: Tentativa de acesso com origem maliciosa
  console.log('🚫 Teste 1: Tentativa de acesso com origem maliciosa')
  try {
    const response = await fetch(`${API_URL}/seo-settings`, {
      headers: {
        'Origin': 'https://malicious-site.com',
        'Content-Type': 'application/json'
      }
    })

    console.log(`Status: ${response.status}`)
    console.log(`Headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2)}`)

    if (response.status === 403 || response.status === 401) {
      console.log('✅ Origem maliciosa BLOQUEADA corretamente')
    } else if (response.status === 200) {
      console.log('❌ Origem maliciosa NÃO foi bloqueada!')
    } else {
      console.log(`⚠️ Status inesperado: ${response.status}`)
    }
  } catch (error) {
    if (error.message.includes('CORS') || error.message.includes('blocked')) {
      console.log('✅ Origem maliciosa BLOQUEADA por CORS')
    } else {
      console.log(`❌ Erro: ${error.message}`)
    }
  }
  console.log('')

  // Teste 2: Acesso com origem permitida
  console.log('✅ Teste 2: Acesso com origem permitida')
  try {
    const response = await fetch(`${API_URL}/seo-settings`, {
      headers: {
        'Origin': 'https://fhdautomacaoindustrialapp.vercel.app',
        'Content-Type': 'application/json'
      }
    })

    console.log(`Status: ${response.status}`)
    console.log(`Headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2)}`)

    if (response.ok) {
      console.log('✅ Origem permitida - ACESSO AUTORIZADO')
    } else {
      console.log(`⚠️ Origem permitida - Status: ${response.status}`)
    }
  } catch (error) {
    console.log(`❌ Erro com origem permitida: ${error.message}`)
  }
  console.log('')

  // Teste 3: Tentativa de acesso admin sem autenticação
  console.log('🔐 Teste 3: Tentativa de acesso admin sem autenticação')
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

    console.log(`Status: ${response.status}`)
    console.log(`Headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2)}`)

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
