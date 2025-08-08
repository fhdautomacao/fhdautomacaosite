// Script de teste para a API de SEO
// Execute com: node scripts/test-seo-api.js

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5173'

async function testSEOSettingsAPI() {
  console.log('🧪 Testando API de SEO Settings...\n')

  const tests = [
    {
      name: 'GET - Listar todas as configurações',
      url: `${API_BASE_URL}/api/seo-settings`,
      method: 'GET'
    },
    {
      name: 'GET - Buscar configuração específica (home)',
      url: `${API_BASE_URL}/api/seo-settings?page_name=home`,
      method: 'GET'
    },
    {
      name: 'GET - Buscar configuração específica (about)',
      url: `${API_BASE_URL}/api/seo-settings?page_name=about`,
      method: 'GET'
    },
    {
      name: 'POST - Criar nova configuração (teste)',
      url: `${API_BASE_URL}/api/seo-settings`,
      method: 'POST',
      body: {
        page_name: 'test-page',
        title: 'Página de Teste - FHD Automação',
        description: 'Esta é uma página de teste para verificar o funcionamento da API de SEO.',
        keywords: 'teste, api, seo, fhd automação',
        canonical_url: 'https://fhdautomacao.com.br/teste',
        og_title: 'Página de Teste - FHD Automação',
        og_description: 'Esta é uma página de teste para verificar o funcionamento da API de SEO.',
        og_image: 'https://fhdautomacao.com.br/og-image.jpg',
        og_site_name: 'FHD Automação Industrial',
        twitter_title: 'Página de Teste - FHD Automação',
        twitter_description: 'Esta é uma página de teste para verificar o funcionamento da API de SEO.',
        twitter_image: 'https://fhdautomacao.com.br/og-image.jpg',
        author: 'FHD Automação Industrial',
        is_active: true
      }
    }
  ]

  for (const test of tests) {
    console.log(`📋 ${test.name}`)
    console.log(`🔗 URL: ${test.url}`)
    console.log(`📡 Método: ${test.method}`)
    
    try {
      const options = {
        method: test.method,
        headers: {
          'Content-Type': 'application/json'
        }
      }

      if (test.body) {
        options.body = JSON.stringify(test.body)
      }

      const response = await fetch(test.url, options)
      const data = await response.json()

      console.log(`✅ Status: ${response.status}`)
      console.log(`📊 Resposta:`, JSON.stringify(data, null, 2))
      
      if (response.ok) {
        console.log('✅ Teste passou!\n')
      } else {
        console.log('❌ Teste falhou!\n')
      }
    } catch (error) {
      console.log(`❌ Erro: ${error.message}\n`)
    }
  }

  // Teste adicional: verificar se a página de teste foi criada
  console.log('🧹 Limpando dados de teste...')
  try {
    const deleteResponse = await fetch(`${API_BASE_URL}/api/seo-settings?page_name=test-page`, {
      method: 'DELETE'
    })
    
    if (deleteResponse.ok) {
      console.log('✅ Dados de teste removidos com sucesso!')
    } else {
      console.log('⚠️ Não foi possível remover dados de teste')
    }
  } catch (error) {
    console.log(`❌ Erro ao limpar dados: ${error.message}`)
  }
}

// Função para testar a conexão com o Supabase
async function testSupabaseConnection() {
  console.log('\n🔗 Testando conexão com Supabase...')
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/seo-settings`)
    const data = await response.json()
    
    if (response.ok && Array.isArray(data)) {
      console.log('✅ Conexão com Supabase funcionando!')
      console.log(`📊 Total de configurações: ${data.length}`)
      
      if (data.length > 0) {
        console.log('📋 Configurações encontradas:')
        data.forEach(item => {
          console.log(`  - ${item.page_name}: ${item.title}`)
        })
      }
    } else {
      console.log('❌ Problema na conexão com Supabase')
      console.log('📊 Resposta:', data)
    }
  } catch (error) {
    console.log(`❌ Erro na conexão: ${error.message}`)
  }
}

// Função principal
async function runTests() {
  console.log('🚀 Iniciando testes da API de SEO Settings\n')
  
  await testSupabaseConnection()
  await testSEOSettingsAPI()
  
  console.log('🎉 Testes concluídos!')
}

// Executar testes se o script for chamado diretamente
if (require.main === module) {
  runTests().catch(console.error)
}

module.exports = { testSEOSettingsAPI, testSupabaseConnection }
