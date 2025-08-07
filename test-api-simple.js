// Teste simples da API de upload
// Execute este script para testar se a API está funcionando

const fs = require('fs');

async function testAPI() {
  try {
    console.log('🧪 Testando API de upload...');
    
    // Criar um arquivo PDF simples
    const pdfContent = '%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Contents 4 0 R\n>>\nendobj\n4 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 12 Tf\n72 720 Td\n(Test PDF) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000204 00000 n \ntrailer\n<<\n/Size 5\n/Root 1 0 R\n>>\nstartxref\n297\n%%EOF';
    
    // Criar FormData
    const FormData = require('form-data');
    const formData = new FormData();
    
    // Criar arquivo temporário
    const tempFile = './temp-test.pdf';
    fs.writeFileSync(tempFile, pdfContent);
    
    formData.append('file', fs.createReadStream(tempFile));
    formData.append('installmentId', '1'); // ID de teste
    
    console.log('📤 Enviando requisição...');
    
    const response = await fetch('http://localhost:3000/api/bills/installments/upload', {
      method: 'POST',
      body: formData,
      headers: {
        ...formData.getHeaders()
      }
    });
    
    console.log('📊 Status:', response.status);
    console.log('📋 Headers:', response.headers);
    
    const result = await response.json();
    console.log('📥 Resposta:', result);
    
    // Limpar arquivo temporário
    fs.unlinkSync(tempFile);
    
    if (response.ok) {
      console.log('✅ API funcionando!');
    } else {
      console.log('❌ API com erro:', result.error);
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  }
}

// Executar teste
testAPI();
