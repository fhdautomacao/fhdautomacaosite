import { Helmet } from 'react-helmet-async'

const DynamicSEO = ({ pageName }) => {
  // Dados de SEO estáticos para cada página
  const getSEOData = (pageName) => {
    const seoData = {
      home: {
        title: 'FHD Automação - Especialistas em Automação Industrial | Sumaré, SP',
        description: 'FHD Automação oferece soluções completas em automação industrial, hidráulica e pneumática. Mais de 10 anos de experiência, 500+ projetos realizados e 98% de satisfação dos clientes em Sumaré, SP.',
        keywords: 'FHD automação, fhd automacao, automação industrial, hidráulica industrial, pneumática industrial, manutenção de máquinas, unidades hidráulicas, peças hidráulicas, Sumaré SP, São Paulo, automação hidráulica, automação pneumática, manutenção industrial, fabricação hidráulica, venda de peças hidráulicas, reparo de máquinas industriais',
        canonical_url: 'https://www.fhdautomacaoindustrial.com.br'
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
        canonical_url: 'https://www.fhdautomacaoindustrial.com.br/produto'
      },
      'service-detail': {
        title: 'Serviços - FHD Automação Industrial | Automação Hidráulica e Pneumática',
        description: 'Conheça nossos serviços de automação industrial. Especialistas em hidráulica e pneumática. FHD Automação Industrial em Sumaré, SP.',
        keywords: 'serviços automação industrial, serviços hidráulica, serviços pneumática, manutenção hidráulica, manutenção pneumática, FHD serviços',
        canonical_url: 'https://www.fhdautomacaoindustrial.com.br/servico'
      }
    }

    return seoData[pageName] || seoData.home
  }

  const seoData = getSEOData(pageName)

  return (
    <Helmet>
      {/* Meta tags básicas */}
      {seoData.title && <title>{seoData.title}</title>}
      {seoData.description && <meta name="description" content={seoData.description} />}
      {seoData.keywords && <meta name="keywords" content={seoData.keywords} />}
      
      {/* URL Canônica */}
      {seoData.canonical_url && <link rel="canonical" href={seoData.canonical_url} />}
      
      {/* Open Graph (Facebook) */}
      <meta property="og:title" content={seoData.title} />
      <meta property="og:description" content={seoData.description} />
      <meta property="og:image" content="https://www.fhdautomacaoindustrial.com.br/logo.png" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={seoData.canonical_url} />
      <meta property="og:site_name" content="FHD Automação Industrial" />
      <meta property="og:locale" content="pt_BR" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoData.title} />
      <meta name="twitter:description" content={seoData.description} />
      <meta name="twitter:image" content="https://www.fhdautomacaoindustrial.com.br/logo.png" />
    </Helmet>
  )
}

export default DynamicSEO
