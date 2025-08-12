// Script para testar a acessibilidade da URL da imagem
const testImageUrl = async (url) => {
  try {
    console.log('🔍 Testando URL:', url)
    
    const response = await fetch(url, {
      method: 'HEAD', // Apenas verificar se existe, sem baixar o conteúdo
      mode: 'cors'
    })
    
    if (response.ok) {
      console.log('✅ URL acessível - Status:', response.status)
      console.log('📊 Headers:', {
        'content-type': response.headers.get('content-type'),
        'content-length': response.headers.get('content-length'),
        'cache-control': response.headers.get('cache-control')
      })
      return true
    } else {
      console.error('❌ URL não acessível - Status:', response.status)
      return false
    }
  } catch (error) {
    console.error('❌ Erro ao testar URL:', error.message)
    return false
  }
}

// URL da imagem do exemplo
const imageUrl = "https://yvbombdbcdyappuziwgx.supabase.co/storage/v1/object/public/arquivos/gallery/1754957268974-unidade.jpeg"

console.log('🚀 Iniciando teste de acessibilidade da imagem...')
testImageUrl(imageUrl).then(isAccessible => {
  if (isAccessible) {
    console.log('🎉 A imagem está acessível!')
  } else {
    console.log('💥 A imagem não está acessível. Verifique:')
    console.log('   1. Se o bucket "arquivos" existe')
    console.log('   2. Se a política RLS permite acesso público')
    console.log('   3. Se o arquivo existe no caminho especificado')
    console.log('   4. Se há problemas de CORS')
  }
})

// Teste adicional com fetch completo
const testFullImageLoad = async (url) => {
  try {
    console.log('🖼️ Testando carregamento completo da imagem...')
    const response = await fetch(url)
    
    if (response.ok) {
      const blob = await response.blob()
      console.log('✅ Imagem carregada completamente')
      console.log('📊 Tamanho:', blob.size, 'bytes')
      console.log('📊 Tipo:', blob.type)
      return true
    } else {
      console.error('❌ Erro ao carregar imagem:', response.status)
      return false
    }
  } catch (error) {
    console.error('❌ Erro no carregamento completo:', error.message)
    return false
  }
}

// Aguardar um pouco e testar o carregamento completo
setTimeout(() => {
  testFullImageLoad(imageUrl)
}, 1000)
