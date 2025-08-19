import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'

const DynamicSEO = ({ pageName, fallbackData = {} }) => {
  const [seoData, setSeoData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Dados de fallback para cada página
  const getFallbackData = (pageName) => {
    const fallbacks = {
      home: {
        title: 'FHD Automação - Especialistas em Automação Industrial | Sumaré, SP',
        description: 'FHD Automação oferece soluções completas em automação industrial, hidráulica e pneumática. Mais de 10 anos de experiência, 500+ projetos realizados e 98% de satisfação dos clientes em Sumaré, SP.',
        keywords: 'FHD automação, fhd automacao, automação industrial, hidráulica industrial, pneumática industrial, manutenção de máquinas, unidades hidráulicas, peças hidráulicas, Sumaré SP, São Paulo, automação hidráulica, automação pneumática, manutenção industrial, fabricação hidráulica, venda de peças hidráulicas, reparo de máquinas industriais',
        author: 'FHD Automação Industrial',
        og_title: 'FHD Automação Industrial - Soluções Hidráulicas e Pneumáticas em Sumaré, SP',
        og_description: 'Especialistas em automação industrial com mais de 10 anos de experiência. Oferecemos soluções completas para suas necessidades hidráulicas e pneumáticas em Sumaré, SP.',
        og_type: 'website',
        og_url: 'https://www.fhdautomacaoindustrial.com.br',
        og_image: 'https://www.fhdautomacaoindustrial.com.br/og-image.jpg',
        twitter_card: 'summary_large_image',
        twitter_title: 'FHD Automação Industrial - Soluções Hidráulicas e Pneumáticas em Sumaré, SP',
        twitter_description: 'Especialistas em automação industrial com mais de 10 anos de experiência. Oferecemos soluções completas para suas necessidades hidráulicas e pneumáticas em Sumaré, SP.',
        canonical_url: 'https://www.fhdautomacaoindustrial.com.br',
        robots: 'index, follow',
        viewport: 'width=device-width, initial-scale=1.0',
        charset: 'UTF-8'
      },
      about: {
        title: 'Quem Somos - FHD Automação Industrial | Especialistas em Automação em Sumaré, SP',
        description: 'Conheça a história da FHD Automação Industrial. Mais de 10 anos de experiência em soluções hidráulicas e pneumáticas, com sede em Sumaré, SP. Especialistas em automação industrial.',
        keywords: 'FHD automação, sobre FHD, história empresa, automação industrial Sumaré, missão visão valores, equipe especializada, FHD Sumaré, automação industrial São Paulo',
        canonical_url: 'https://www.fhdautomacaoindustrial.com.br/quem-somos'
      },
      services: {
        title: 'Nossos Serviços - FHD Automação Industrial | Automação Hidráulica e Pneumática',
        description: 'Conheça todos os serviços da FHD Automação Industrial: automação hidráulica e pneumática, projetos personalizados, manutenção especializada e muito mais em Sumaré, SP.',
        keywords: 'serviços automação industrial, manutenção hidráulica, projetos pneumáticos, instalação tubulações, fabricação unidades hidráulicas, automação hidráulica, automação pneumática, FHD serviços',
        canonical_url: 'https://www.fhdautomacaoindustrial.com.br/servicos'
      },
      contact: {
        title: 'Contato - FHD Automação Industrial | Sumaré, SP',
        description: 'Entre em contato com a FHD Automação Industrial. Telefone: (19) 99865-2144. E-mail: comercial@fhdautomacao.com.br. Endereço em Sumaré, SP.',
        keywords: 'contato FHD Automação, telefone automação industrial, endereço Sumaré SP, orçamento hidráulica pneumática, FHD contato',
        canonical_url: 'https://www.fhdautomacaoindustrial.com.br/contato'
      },
      clients: {
        title: 'Nossos Clientes - FHD Automação Industrial | Projetos Realizados',
        description: 'Conheça os clientes satisfeitos da FHD Automação Industrial e os projetos de sucesso que realizamos em automação hidráulica e pneumática em Sumaré, SP.',
        keywords: 'clientes FHD, projetos realizados, automação industrial, hidráulica, pneumática, cases de sucesso, FHD clientes',
        canonical_url: 'https://www.fhdautomacaoindustrial.com.br/clientes'
      },
      quotation: {
        title: 'Solicitar Orçamento - FHD Automação Industrial | Orçamento Gratuito',
        description: 'Solicite seu orçamento personalizado para projetos de automação industrial, sistemas hidráulicos e pneumáticos. Resposta em até 24 horas. FHD Automação Industrial.',
        keywords: 'orçamento automação industrial, cotação hidráulica, preço pneumática, solicitar orçamento, FHD orçamento, orçamento gratuito',
        canonical_url: 'https://www.fhdautomacaoindustrial.com.br/orcamento'
      },
      'product-detail': {
        title: 'Produtos - FHD Automação Industrial | Peças Hidráulicas e Pneumáticas',
        description: 'Conheça nossos produtos de automação industrial. Qualidade e garantia em hidráulica e pneumática. FHD Automação Industrial em Sumaré, SP.',
        keywords: 'produtos automação industrial, produtos hidráulica, produtos pneumática, cilindros hidráulicos, válvulas hidráulicas, bombas hidráulicas, FHD produtos',
        canonical_url: 'https://www.fhdautomacaoindustrial.com.br/produto',
        robots: 'index, follow'
      },
      'service-detail': {
        title: 'Serviços - FHD Automação Industrial | Automação Hidráulica e Pneumática',
        description: 'Conheça nossos serviços de automação industrial. Especialistas em hidráulica e pneumática. FHD Automação Industrial em Sumaré, SP.',
        keywords: 'serviços automação industrial, serviços hidráulica, serviços pneumática, manutenção hidráulica, manutenção pneumática, FHD serviços',
        canonical_url: 'https://www.fhdautomacaoindustrial.com.br/servico',
        robots: 'index, follow'
      }
    }

    return fallbacks[pageName] || fallbackData
  }

  useEffect(() => {
    const fetchSEOData = async () => {
      try {
        setLoading(true)
        
        // Verificar se estamos em modo de desenvolvimento sem API
        const isDevWithoutAPI = import.meta.env.DEV && !import.meta.env.VITE_SUPABASE_URL
        
        if (isDevWithoutAPI) {
          setSeoData(getFallbackData(pageName))
          return
        }
        
        // Tentar buscar dados da API
        const response = await fetch(`/api/seo-settings?page_name=${pageName}`)
        
        // Verificar se a resposta é JSON válido
        const contentType = response.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) {
          console.warn('⚠️ [DynamicSEO] API retornou dados não-JSON, usando fallback')
          console.error('🔍 [DynamicSEO] Content-Type recebido:', contentType)
          console.error('🔍 [DynamicSEO] Status da resposta:', response.status)
          console.error('🔍 [DynamicSEO] URL da API:', `/api/seo-settings?page_name=${pageName}`)
          
          // Tentar ler o corpo da resposta para debug
          try {
            const responseText = await response.text()
            console.error('🔍 [DynamicSEO] Corpo da resposta:', responseText.substring(0, 500))
          } catch (e) {
            console.error('🔍 [DynamicSEO] Não foi possível ler o corpo da resposta')
          }
          
          setSeoData(getFallbackData(pageName))
          return
        }

        const result = await response.json()
        
        if (result.success && result.data) {
          setSeoData(result.data)
        } else {
          setSeoData(getFallbackData(pageName))
        }
      } catch (error) {
        setSeoData(getFallbackData(pageName))
      } finally {
        setLoading(false)
      }
    }

    if (pageName) {
      fetchSEOData()
    }
  }, [pageName])

  if (loading || !seoData) {
    return null
  }

  return (
    <Helmet>
      {/* Meta tags básicas */}
      {seoData.title && <title>{seoData.title}</title>}
      {seoData.description && <meta name="description" content={seoData.description} />}
      {seoData.keywords && <meta name="keywords" content={seoData.keywords} />}
      {seoData.author && <meta name="author" content={seoData.author} />}
      {seoData.robots && <meta name="robots" content={seoData.robots} />}
      {seoData.viewport && <meta name="viewport" content={seoData.viewport} />}
      {seoData.charset && <meta charSet={seoData.charset} />}
      
      {/* Favicon */}
      {seoData.favicon_url && <link rel="icon" href={seoData.favicon_url} />}
      
      {/* URL Canônica */}
      {seoData.canonical_url && <link rel="canonical" href={seoData.canonical_url} />}
      
      {/* Open Graph (Facebook) */}
      {seoData.og_title && <meta property="og:title" content={seoData.og_title} />}
      {seoData.og_description && <meta property="og:description" content={seoData.og_description} />}
      {seoData.og_image && <meta property="og:image" content={seoData.og_image} />}
      {seoData.og_type && <meta property="og:type" content={seoData.og_type} />}
      {seoData.og_site_name && <meta property="og:site_name" content={seoData.og_site_name} />}
      {seoData.og_locale && <meta property="og:locale" content={seoData.og_locale} />}
      {seoData.canonical_url && <meta property="og:url" content={seoData.canonical_url} />}
      
      {/* Twitter */}
      {seoData.twitter_card && <meta name="twitter:card" content={seoData.twitter_card} />}
      {seoData.twitter_title && <meta name="twitter:title" content={seoData.twitter_title} />}
      {seoData.twitter_description && <meta name="twitter:description" content={seoData.twitter_description} />}
      {seoData.twitter_image && <meta name="twitter:image" content={seoData.twitter_image} />}
      
      {/* Dados Estruturados (JSON-LD) */}
      {seoData.structured_data && (
        <script type="application/ld+json">
          {JSON.stringify(seoData.structured_data)}
        </script>
      )}
    </Helmet>
  )
}

export default DynamicSEO
