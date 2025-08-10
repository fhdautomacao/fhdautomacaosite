#!/usr/bin/env node

/**
 * Script de teste para verificar a proteção CORS
 * Execute com: node scripts/test-cors.js
 */

const fetch = require('node-fetch')

const API_BASE_URL = process.env.API_URL || 'http://localhost:3001'

// Configurações de teste
const testConfigs = [
  {
    name: '✅ Frontend Local (Permitido)',
    origin: 'http://localhost:5173',
    shouldWork: true
  },
  {
    name: '✅ Frontend Alternativo (Permitido)',
    origin: 'http://localhost:3000',
    shouldWork: true
  },
  {
    name: '✅ Produção Antiga (Permitido)',
    origin: 'https://fhd-automacao-industrial-bq67.vercel.app',
    shouldWork: true
  },
  {
    name: '✅ Admin Produção Antiga (Permitido)',
    origin: 'https://fhd-automacao-industrial-bq67.vercel.app/admin',
    shouldWork: true
  },
  {
    name: '✅ Nova Produção (Permitido)',
    origin: 'https://fhdautomacaoindustrialapp.vercel.app',
    shouldWork: true
  },
  {
    name: '✅ Nova Admin Produção (Permitido)',
    origin: 'https://fhdautomacaoindustrialapp.vercel.app/admin',
    shouldWork: true
  },
  {
    name: '❌ Site Malicioso (Bloqueado)',
    origin: 'https://malicious-site.com',
    shouldWork: false
  },
  {
    name: '❌ IP Local Diferente (Bloqueado)',
    origin: 'http://192.168.1.100:3000',
    shouldWork: false
  }
]

// Teste de autenticação admin
const adminTests = [
  {
    name: '✅ Requisição Admin com Header (Permitido)',
    headers: {
      'X-Admin-Request': 'true',
      'Authorization': 'Bearer test-token'
    },
    shouldWork: true
  },
  {
    name: '❌ Requisição Admin sem Autenticação (Bloqueado)',
    headers: {
      'X-Admin-Request': 'true'
    },
    shouldWork: false
  },
  {
    name: '✅ Requisição Pública (Permitido)',
    headers: {},
    shouldWork: true
  }
]

async function testCORS() {
  console.log('🔒 Testando Proteção CORS\n')
  console.log(`🌐 API URL: ${API_BASE_URL}\n`)

  // Teste 1: Verificar se a API está rodando
  console.log('📡 Teste 1: Verificar se a API está rodando')
  try {
    const healthResponse = await fetch(`${API_BASE_URL}/health`)
    if (healthResponse.ok) {
      const healthData = await healthResponse.json()
      console.log('✅ API está rodando:', healthData.message)
    } else {
      console.log('❌ API não está respondendo')
      return
    }
  } catch (error) {
    console.log('❌ Erro ao conectar com a API:', error.message)
    return
  }
  console.log('')

  // Teste 2: Testar diferentes origens
  console.log('🌍 Teste 2: Testar diferentes origens')
  for (const config of testConfigs) {
    try {
      const response = await fetch(`${API_BASE_URL}/seo-settings`, {
        headers: {
          'Origin': config.origin,
          'Content-Type': 'application/json'
        }
      })

      if (config.shouldWork) {
        if (response.ok) {
          console.log(`${config.name} - ✅ Funcionou como esperado`)
        } else {
          console.log(`${config.name} - ❌ Falhou quando deveria funcionar (${response.status})`)
        }
      } else {
        if (!response.ok && response.status === 403) {
          console.log(`${config.name} - ✅ Bloqueado como esperado`)
        } else {
          console.log(`${config.name} - ❌ Não foi bloqueado quando deveria (${response.status})`)
        }
      }
    } catch (error) {
      if (config.shouldWork) {
        console.log(`${config.name} - ❌ Erro inesperado: ${error.message}`)
      } else {
        console.log(`${config.name} - ✅ Erro esperado (CORS): ${error.message}`)
      }
    }
  }
  console.log('')

  // Teste 3: Testar autenticação admin
  console.log('🔐 Teste 3: Testar autenticação admin')
  for (const test of adminTests) {
    try {
      const response = await fetch(`${API_BASE_URL}/seo-settings`, {
        method: 'POST',
        headers: {
          'Origin': 'http://localhost:5173',
          'Content-Type': 'application/json',
          ...test.headers
        },
        body: JSON.stringify({
          page_name: 'test-page',
          title: 'Test Page'
        })
      })

      if (test.shouldWork) {
        if (response.ok || response.status === 400) { // 400 é esperado para dados inválidos
          console.log(`${test.name} - ✅ Funcionou como esperado`)
        } else {
          console.log(`${test.name} - ❌ Falhou quando deveria funcionar (${response.status})`)
        }
      } else {
        if (response.status === 401) {
          console.log(`${test.name} - ✅ Bloqueado como esperado`)
        } else {
          console.log(`${test.name} - ❌ Não foi bloqueado quando deveria (${response.status})`)
        }
      }
    } catch (error) {
      console.log(`${test.name} - ❌ Erro: ${error.message}`)
    }
  }
  console.log('')

  // Teste 4: Testar métodos HTTP
  console.log('📋 Teste 4: Testar métodos HTTP permitidos')
  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  
  for (const method of methods) {
    try {
      const response = await fetch(`${API_BASE_URL}/seo-settings`, {
        method: method,
        headers: {
          'Origin': 'http://localhost:5173',
          'Content-Type': 'application/json'
        }
      })

      if (response.status !== 405) { // 405 = Method Not Allowed
        console.log(`✅ ${method} - Permitido`)
      } else {
        console.log(`❌ ${method} - Não permitido`)
      }
    } catch (error) {
      console.log(`❌ ${method} - Erro: ${error.message}`)
    }
  }
  console.log('')

  console.log('🎉 Testes de CORS concluídos!')
}

// Executar testes
if (require.main === module) {
  testCORS().catch(console.error)
}

module.exports = { testCORS }
