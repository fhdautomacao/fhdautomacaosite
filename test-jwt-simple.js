#!/usr/bin/env node

/**
 * Teste Simples do Sistema JWT
 */

const API_URL = 'https://fhdautomacaoindustrialapp.vercel.app/api'

async function testSimple() {
  console.log('🔐 Teste Simples JWT\n')
  console.log(`🌐 API URL: ${API_URL}\n`)

  // Teste 1: Verificar se a API está respondendo
  console.log('📡 Teste 1: Verificar se a API está respondendo')
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

    console.log(`Status: ${response.status}`)
    console.log(`Headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2)}`)

    if (response.ok) {
      const data = await response.json()
      console.log('✅ API está respondendo')
      console.log('📄 Resposta:', JSON.stringify(data, null, 2))
    } else {
      console.log('❌ API não está respondendo corretamente')
      const text = await response.text()
      console.log('📄 Resposta:', text)
    }
  } catch (error) {
    console.log('❌ Erro ao conectar com a API:', error.message)
  }
}

testSimple().catch(console.error)
