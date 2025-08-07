// Script de teste para upload de comprovantes
// Execute este script para testar a API de upload

const fs = require('fs');
const FormData = require('form-data');

async function testUpload() {
  try {
    console.log('🧪 Iniciando teste de upload...');
    
    // Criar um arquivo PDF de teste
    const testPdfPath = './test-receipt.pdf';
    
    // Verificar se o arquivo de teste existe
    if (!fs.existsSync(testPdfPath)) {
      console.log('📄 Criando arquivo PDF de teste...');
      // Criar um PDF simples para teste
      const pdfContent = '%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Contents 4 0 R\n>>\nendobj\n4 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 12 Tf\n72 720 Td\n(Test PDF) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000204 00000 n \ntrailer\n<<\n/Size 5\n/Root 1 0 R\n>>\nstartxref\n297\n%%EOF';
      fs.writeFileSync(testPdfPath, pdfContent);
    }
    
    // Criar FormData
    const formData = new FormData();
    formData.append('file', fs.createReadStream(testPdfPath));
    formData.append('installmentId', '1'); // ID de teste
    
    console.log('📤 Enviando requisição de teste...');
    
    // Fazer requisição para a API
    const response = await fetch('http://localhost:3000/api/bills/installments/upload', {
      method: 'POST',
      body: formData,
      headers: {
        ...formData.getHeaders(),
        'Authorization': 'Bearer seu_token_aqui' // Adicionar token se necessário
      }
    });
    
    console.log('📊 Status da resposta:', response.status);
    console.log('📋 Headers da resposta:', response.headers);
    
    const result = await response.json();
    console.log('📥 Resposta da API:', result);
    
    if (response.ok) {
      console.log('✅ Teste de upload bem-sucedido!');
      console.log('📁 Arquivo salvo em:', result.receipt?.path);
      console.log('🔗 URL pública:', result.receipt?.url);
    } else {
      console.log('❌ Teste de upload falhou!');
      console.log('🚨 Erro:', result.error);
      console.log('📋 Detalhes:', result.details);
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  }
}

// Função para testar conectividade com Supabase
async function testSupabaseConnection() {
  try {
    console.log('🔍 Testando conexão com Supabase...');
    
    const { createClient } = require('@supabase/supabase-js');
    
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Variáveis de ambiente do Supabase não encontradas');
      return;
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Testar conexão listando buckets
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('❌ Erro ao conectar com Supabase:', error);
      return;
    }
    
    console.log('✅ Conexão com Supabase estabelecida!');
    console.log('📦 Buckets disponíveis:', buckets.map(b => b.name));
    
    // Testar acesso ao bucket arquivos
    const { data: files, error: listError } = await supabase.storage
      .from('arquivos')
      .list('', { limit: 5 });
    
    if (listError) {
      console.error('❌ Erro ao acessar bucket arquivos:', listError);
    } else {
      console.log('✅ Bucket arquivos acessível!');
      console.log('📁 Arquivos encontrados:', files?.length || 0);
    }
    
  } catch (error) {
    console.error('❌ Erro ao testar Supabase:', error);
  }
}

// Executar testes
async function runTests() {
  console.log('🚀 Iniciando testes de upload...\n');
  
  await testSupabaseConnection();
  console.log('');
  await testUpload();
  
  console.log('\n✅ Testes concluídos!');
}

// Executar se chamado diretamente
if (require.main === module) {
  runTests();
}

module.exports = { testUpload, testSupabaseConnection };
