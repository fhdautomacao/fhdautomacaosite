// Script de teste para o componente DynamicSEO
// Execute com: node scripts/test-dynamic-seo.js

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5173'

async function testDynamicSEO() {
  console.log('🧪 Testando componente DynamicSEO...\n')

  const tests = [
    {
      name: 'Teste 1: Buscar dados da página "home"',
      pageName: 'home',
      expectedFields: ['title', 'description', 'keywords', 'og_title', 'og_description']
    },
    {
      name: 'Teste 2: Buscar dados da página "about"',
      pageName: 'about',
      expectedFields: ['title', 'description', 'keywords', 'og_title', 'og_description']
    },
    {
      name: 'Teste 3: Buscar dados da página "services"',
      pageName: 'services',
      expectedFields: ['title', 'description', 'keywords', 'og_title', 'og_description']
    },
    {
      name: 'Teste 4: Buscar dados da página "contact"',
      pageName: 'contact',
      expectedFields: ['title', 'description', 'keywords', 'og_title', 'og_description']
    },
    {
      name: 'Teste 5: Buscar dados da página "clients"',
      pageName: 'clients',
      expectedFields: ['title', 'description', 'keywords', 'og_title', 'og_description']
    },
    {
      name: 'Teste 6: Buscar dados da página "quotation"',
      pageName: 'quotation',
      expectedFields: ['title', 'description', 'keywords', 'og_title', 'og_description']
    }
  ]

  for (const test of tests) {
    console.log(`📋 ${test.name}`)
    console.log(`🔗 URL: ${API_BASE_URL}/api/seo-settings?page_name=${test.pageName}`)
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/seo-settings?page_name=${test.pageName}`)
      const data = await response.json()

      console.log(`✅ Status: ${response.status}`)
      
      if (response.ok && data.success && data.data) {
        console.log('✅ Dados encontrados!')
        
        // Verificar campos obrigatórios
        const missingFields = test.expectedFields.filter(field => !data.data[field])
        
        if (missingFields.length === 0) {
          console.log('✅ Todos os campos obrigatórios estão presentes')
          console.log(`📊 Título: ${data.data.title}`)
          console.log(`📊 Descrição: ${data.data.description?.substring(0, 100)}...`)
          console.log(`📊 Keywords: ${data.data.keywords?.substring(0, 50)}...`)
        } else {
          console.log(`⚠️ Campos faltando: ${missingFields.join(', ')}`)
        }
      } else {
        console.log('❌ Dados não encontrados ou erro na API')
        console.log('📊 Resposta:', data)
      }
      
      console.log('')
    } catch (error) {
      console.log(`❌ Erro: ${error.message}\n`)
    }
  }

  // Teste de integração com o componente
  console.log('🔧 Teste de Integração do Componente DynamicSEO')
  console.log('Para testar o componente em uma página, adicione:')
  console.log('')
  console.log('import DynamicSEO from "@/components/common/DynamicSEO"')
  console.log('')
  console.log('<DynamicSEO pageName="home" />')
  console.log('')
  console.log('E verifique se as meta tags aparecem no <head> da página')
}

// Função para testar se a API está retornando dados corretos
async function testAPIResponse() {
  console.log('\n🔍 Testando resposta da API...')
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/seo-settings`)
    const data = await response.json()
    
    if (response.ok && data.success && Array.isArray(data.data)) {
      console.log('✅ API funcionando corretamente!')
      console.log(`📊 Total de configurações: ${data.data.length}`)
      
      data.data.forEach(item => {
        console.log(`  - ${item.page_name}: ${item.title}`)
      })
    } else {
      console.log('❌ Problema na API')
      console.log('📊 Resposta:', data)
    }
  } catch (error) {
    console.log(`❌ Erro na API: ${error.message}`)
  }
}

// Função para verificar se o componente está sendo usado
function checkComponentUsage() {
  console.log('\n📋 Verificação de Uso do Componente DynamicSEO')
  console.log('')
  console.log('Páginas que DEVEM usar o DynamicSEO:')
  console.log('✅ src/pages/public/HomePage.jsx - pageName="home"')
  console.log('✅ src/pages/public/AboutPage.jsx - pageName="about"')
  console.log('✅ src/pages/public/ServicesPage.jsx - pageName="services"')
  console.log('✅ src/pages/public/ContactPage.jsx - pageName="contact"')
  console.log('✅ src/pages/public/ClientsPage.jsx - pageName="clients"')
  console.log('✅ src/pages/QuotationPage.jsx - pageName="quotation"')
  console.log('')
  console.log('Para implementar, substitua o <Helmet> atual por:')
  console.log('')
  console.log('import DynamicSEO from "@/components/common/DynamicSEO"')
  console.log('')
  console.log('<DynamicSEO pageName="nome-da-pagina" />')
}

// Função principal
async function runTests() {
  console.log('🚀 Iniciando testes do componente DynamicSEO\n')
  
  await testAPIResponse()
  await testDynamicSEO()
  checkComponentUsage()
  
  console.log('\n🎉 Testes concluídos!')
  console.log('\n💡 Próximos passos:')
  console.log('1. Implemente o DynamicSEO nas páginas')
  console.log('2. Teste as meta tags no navegador')
  console.log('3. Verifique no Google Search Console')
}

// Executar testes se o script for chamado diretamente
if (require.main === module) {
  runTests().catch(console.error)
}

module.exports = { testDynamicSEO, testAPIResponse, checkComponentUsage }
