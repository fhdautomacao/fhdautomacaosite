import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'

const DynamicSEO = ({ pageName, fallbackData = {} }) => {
  const [seoData, setSeoData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Dados de fallback para cada página
  const getFallbackData = (pageName) => {
    const fallbacks = {
      home: {
        title: 'FHD Automação Industrial - Manutenção de Máquinas Industriais e Fabricação de Unidades Hidráulicas',
        description: 'FHD Automação Industrial: Especialistas em manutenção de máquinas industriais, fabricação de unidades hidráulicas, venda de peças hidráulicas e pneumáticas. Mais de 10 anos de experiência em Sumaré, SP.',
        keywords: 'manutenção de máquinas industriais, fabricação de unidades hidráulicas, peças hidráulicas, manutenção industrial, unidades hidráulicas, peças para máquinas industriais, manutenção de equipamentos industriais, fabricação hidráulica, venda de peças hidráulicas, reparo de máquinas industriais, manutenção preventiva industrial, peças hidráulicas industriais, unidades hidráulicas industriais, manutenção de cilindros hidráulicos, manutenção de bombas hidráulicas, manutenção de válvulas hidráulicas, fabricação de peças hidráulicas, automação industrial, hidráulica industrial, pneumática industrial, manutenção de equipamentos hidráulicos, peças para automação industrial, manutenção de sistemas hidráulicos, fabricação de componentes hidráulicos, venda de peças para máquinas, manutenção de máquinas, reparo de equipamentos industriais, peças industriais, componentes hidráulicos, sistemas hidráulicos industriais, manutenção de sistemas pneumáticos, peças pneumáticas, automação hidráulica, automação pneumática, manutenção de atuadores, manutenção de motores hidráulicos, manutenção de bombas pneumáticas, fabricação de sistemas hidráulicos, venda de componentes industriais, manutenção de máquinas CNC, peças para máquinas CNC, manutenção de prensas hidráulicas, manutenção de injetoras, manutenção de extrusoras, manutenção de máquinas de embalagem, manutenção de máquinas têxteis, manutenção de máquinas de plástico, manutenção de máquinas de papel, manutenção de máquinas de metalurgia, manutenção de máquinas de mineração, manutenção de máquinas agrícolas, manutenção de máquinas de construção, manutenção de máquinas de alimentação, manutenção de máquinas farmacêuticas, manutenção de máquinas químicas, manutenção de máquinas de borracha, manutenção de máquinas de vidro, manutenção de máquinas de cerâmica, manutenção de máquinas de madeira, manutenção de máquinas de couro, manutenção de máquinas de calçados, manutenção de máquinas de móveis, manutenção de máquinas de brinquedos, manutenção de máquinas de eletrônicos, manutenção de máquinas de informática, manutenção de máquinas de telecomunicações, manutenção de máquinas de energia, manutenção de máquinas de petróleo, manutenção de máquinas de gás, manutenção de máquinas de água, manutenção de máquinas de esgoto, manutenção de máquinas de tratamento de resíduos, manutenção de máquinas de reciclagem, manutenção de máquinas de compostagem, manutenção de máquinas de incineração, manutenção de máquinas de aterro sanitário, manutenção de máquinas de coleta de lixo, manutenção de máquinas de varrição, manutenção de máquinas de limpeza urbana, manutenção de máquinas de iluminação pública, manutenção de máquinas de sinalização, manutenção de máquinas de segurança, manutenção de máquinas de vigilância, manutenção de máquinas de controle de acesso, manutenção de máquinas de alarme, manutenção de máquinas de sprinkler, manutenção de máquinas de extintor, manutenção de máquinas de hidrante, manutenção de máquinas de bombeiro, manutenção de máquinas de ambulância, manutenção de máquinas de polícia, manutenção de máquinas de exército, manutenção de máquinas de marinha, manutenção de máquinas de aeronáutica, manutenção de máquinas de aviação, manutenção de máquinas de navegação, manutenção de máquinas de transporte, manutenção de máquinas de logística, manutenção de máquinas de armazenagem, manutenção de máquinas de movimentação, manutenção de máquinas de elevação, manutenção de máquinas de guincho, manutenção de máquinas de empilhadeira, manutenção de máquinas de ponte rolante, manutenção de máquinas de talha, manutenção de máquinas de monoviga, manutenção de máquinas de pórtico, manutenção de máquinas de carro ponte, manutenção de máquinas de carro trolley, manutenção de máquinas de carro principal, manutenção de máquinas de carro secundário, manutenção de máquinas de carro de elevação, manutenção de máquinas de carro de translação, manutenção de máquinas de carro de rotação, manutenção de máquinas de carro de inclinação, manutenção de máquinas de carro de oscilação, manutenção de máquinas de carro de vibração, manutenção de máquinas de carro de impacto, manutenção de máquinas de carro de compressão, manutenção de máquinas de carro de tração, manutenção de máquinas de carro de torção, manutenção de máquinas de carro de flexão, manutenção de máquinas de carro de cisalhamento, manutenção de máquinas de carro de corte, manutenção de máquinas de carro de dobra, manutenção de máquinas de carro de calandra, manutenção de máquinas de carro de laminador, manutenção de máquinas de carro de trefilador, manutenção de máquinas de carro de extrusor, manutenção de máquinas de carro de injetor, manutenção de máquinas de carro de soprador, manutenção de máquinas de carro de termoformador, manutenção de máquinas de carro de rotomoldador, manutenção de máquinas de carro de calandrador, manutenção de máquinas de carro de laminador, manutenção de máquinas de carro de trefilador, manutenção de máquinas de carro de extrusor, manutenção de máquinas de carro de injetor, manutenção de máquinas de carro de soprador, manutenção de máquinas de carro de termoformador, manutenção de máquinas de carro de rotomoldador, FHD Automação, FHD, automação industrial Sumaré, hidráulica Sumaré, pneumática Sumaré, manutenção industrial Sumaré, peças hidráulicas Sumaré, unidades hidráulicas Sumaré, manutenção de máquinas Sumaré, fabricação hidráulica Sumaré, venda de peças Sumaré, reparo industrial Sumaré, automação Sumaré, hidráulica industrial Sumaré, pneumática industrial Sumaré, manutenção de equipamentos Sumaré, peças industriais Sumaré, componentes hidráulicos Sumaré, sistemas hidráulicos Sumaré, manutenção de sistemas Sumaré, peças pneumáticas Sumaré, automação hidráulica Sumaré, automação pneumática Sumaré, manutenção de atuadores Sumaré, manutenção de motores Sumaré, manutenção de bombas Sumaré, fabricação de sistemas Sumaré, venda de componentes Sumaré, manutenção de máquinas CNC Sumaré, peças para máquinas CNC Sumaré, manutenção de prensas Sumaré, manutenção de injetoras Sumaré, manutenção de extrusoras Sumaré, manutenção de máquinas de embalagem Sumaré, manutenção de máquinas têxteis Sumaré, manutenção de máquinas de plástico Sumaré, manutenção de máquinas de papel Sumaré, manutenção de máquinas de metalurgia Sumaré, manutenção de máquinas de mineração Sumaré, manutenção de máquinas agrícolas Sumaré, manutenção de máquinas de construção Sumaré, manutenção de máquinas de alimentação Sumaré, manutenção de máquinas farmacêuticas Sumaré, manutenção de máquinas químicas Sumaré, manutenção de máquinas de borracha Sumaré, manutenção de máquinas de vidro Sumaré, manutenção de máquinas de cerâmica Sumaré, manutenção de máquinas de madeira Sumaré, manutenção de máquinas de couro Sumaré, manutenção de máquinas de calçados Sumaré, manutenção de máquinas de móveis Sumaré, manutenção de máquinas de brinquedos Sumaré, manutenção de máquinas de eletrônicos Sumaré, manutenção de máquinas de informática Sumaré, manutenção de máquinas de telecomunicações Sumaré, manutenção de máquinas de energia Sumaré, manutenção de máquinas de petróleo Sumaré, manutenção de máquinas de gás Sumaré, manutenção de máquinas de água Sumaré, manutenção de máquinas de esgoto Sumaré, manutenção de máquinas de tratamento de resíduos Sumaré, manutenção de máquinas de reciclagem Sumaré, manutenção de máquinas de compostagem Sumaré, manutenção de máquinas de incineração Sumaré, manutenção de máquinas de aterro sanitário Sumaré, manutenção de máquinas de coleta de lixo Sumaré, manutenção de máquinas de varrição Sumaré, manutenção de máquinas de limpeza urbana Sumaré, manutenção de máquinas de iluminação pública Sumaré, manutenção de máquinas de sinalização Sumaré, manutenção de máquinas de segurança Sumaré, manutenção de máquinas de vigilância Sumaré, manutenção de máquinas de controle de acesso Sumaré, manutenção de máquinas de alarme Sumaré, manutenção de máquinas de sprinkler Sumaré, manutenção de máquinas de extintor Sumaré, manutenção de máquinas de hidrante Sumaré, manutenção de máquinas de bombeiro Sumaré, manutenção de máquinas de ambulância Sumaré, manutenção de máquinas de polícia Sumaré, manutenção de máquinas de exército Sumaré, manutenção de máquinas de marinha Sumaré, manutenção de máquinas de aeronáutica Sumaré, manutenção de máquinas de aviação Sumaré, manutenção de máquinas de navegação Sumaré, manutenção de máquinas de transporte Sumaré, manutenção de máquinas de logística Sumaré, manutenção de máquinas de armazenagem Sumaré, manutenção de máquinas de movimentação Sumaré, manutenção de máquinas de elevação Sumaré, manutenção de máquinas de guincho Sumaré, manutenção de máquinas de empilhadeira Sumaré, manutenção de máquinas de ponte rolante Sumaré, manutenção de máquinas de talha Sumaré, manutenção de máquinas de monoviga Sumaré, manutenção de máquinas de pórtico Sumaré, manutenção de máquinas de carro ponte Sumaré, manutenção de máquinas de carro trolley Sumaré, manutenção de máquinas de carro principal Sumaré, manutenção de máquinas de carro secundário Sumaré, manutenção de máquinas de carro de elevação Sumaré, manutenção de máquinas de carro de translação Sumaré, manutenção de máquinas de carro de rotação Sumaré, manutenção de máquinas de carro de inclinação Sumaré, manutenção de máquinas de carro de oscilação Sumaré, manutenção de máquinas de carro de vibração Sumaré, manutenção de máquinas de carro de impacto Sumaré, manutenção de máquinas de carro de compressão Sumaré, manutenção de máquinas de carro de tração Sumaré, manutenção de máquinas de carro de torção Sumaré, manutenção de máquinas de carro de flexão Sumaré, manutenção de máquinas de carro de cisalhamento Sumaré, manutenção de máquinas de carro de corte Sumaré, manutenção de máquinas de carro de dobra Sumaré, manutenção de máquinas de carro de calandra Sumaré, manutenção de máquinas de carro de laminador Sumaré, manutenção de máquinas de carro de trefilador Sumaré, manutenção de máquinas de carro de extrusor Sumaré, manutenção de máquinas de carro de injetor Sumaré, manutenção de máquinas de carro de soprador Sumaré, manutenção de máquinas de carro de termoformador Sumaré, manutenção de máquinas de carro de rotomoldador Sumaré, manutenção de máquinas de carro de calandrador Sumaré, manutenção de máquinas de carro de laminador Sumaré, manutenção de máquinas de carro de trefilador Sumaré, manutenção de máquinas de carro de extrusor Sumaré, manutenção de máquinas de carro de injetor Sumaré, manutenção de máquinas de carro de soprador Sumaré, manutenção de máquinas de carro de termoformador Sumaré, manutenção de máquinas de carro de rotomoldador Sumaré, São Paulo, SP, Brasil',
        author: 'FHD Automação Industrial',
        og_title: 'FHD Automação Industrial - Manutenção de Máquinas Industriais e Fabricação de Unidades Hidráulicas',
        og_description: 'Especialistas em manutenção de máquinas industriais, fabricação de unidades hidráulicas, venda de peças hidráulicas e pneumáticas. Mais de 10 anos de experiência em Sumaré, SP.',
        og_type: 'website',
        og_url: 'https://fhdautomacao.com.br',
        og_image: 'https://fhdautomacao.com.br/og-image.jpg',
        twitter_card: 'summary_large_image',
        twitter_title: 'FHD Automação Industrial - Manutenção de Máquinas Industriais e Fabricação de Unidades Hidráulicas',
        twitter_description: 'Especialistas em manutenção de máquinas industriais, fabricação de unidades hidráulicas, venda de peças hidráulicas e pneumáticas. Mais de 10 anos de experiência em Sumaré, SP.',
        canonical_url: 'https://fhdautomacao.com.br',
        robots: 'index, follow',
        viewport: 'width=device-width, initial-scale=1.0',
        charset: 'UTF-8'
      },
      about: {
        title: 'FHD Automação Industrial - Quem Somos | Manutenção de Máquinas Industriais e Fabricação de Unidades Hidráulicas',
        description: 'FHD Automação Industrial: Empresa especializada em manutenção de máquinas industriais, fabricação de unidades hidráulicas e venda de peças hidráulicas. Mais de 10 anos de experiência em Sumaré, SP. Conheça nossa história, missão e valores.',
        keywords: 'FHD, FHD Automação, FHD Automação Industrial, quem somos FHD, sobre FHD, história FHD, empresa FHD, FHD Sumaré, FHD São Paulo, FHD Brasil, FHD automação industrial, FHD manutenção, FHD hidráulica, FHD pneumática, FHD peças, FHD unidades hidráulicas, FHD fabricação, FHD venda, FHD reparo, FHD manutenção de máquinas, FHD manutenção industrial, FHD manutenção de equipamentos, FHD manutenção de sistemas, FHD manutenção de cilindros, FHD manutenção de bombas, FHD manutenção de válvulas, FHD manutenção de atuadores, FHD manutenção de motores, FHD manutenção de prensas, FHD manutenção de injetoras, FHD manutenção de extrusoras, FHD manutenção de máquinas CNC, FHD manutenção de máquinas de embalagem, FHD manutenção de máquinas têxteis, FHD manutenção de máquinas de plástico, FHD manutenção de máquinas de papel, FHD manutenção de máquinas de metalurgia, FHD manutenção de máquinas de mineração, FHD manutenção de máquinas agrícolas, FHD manutenção de máquinas de construção, FHD manutenção de máquinas de alimentação, FHD manutenção de máquinas farmacêuticas, FHD manutenção de máquinas químicas, FHD manutenção de máquinas de borracha, FHD manutenção de máquinas de vidro, FHD manutenção de máquinas de cerâmica, FHD manutenção de máquinas de madeira, FHD manutenção de máquinas de couro, FHD manutenção de máquinas de calçados, FHD manutenção de máquinas de móveis, FHD manutenção de máquinas de brinquedos, FHD manutenção de máquinas de eletrônicos, FHD manutenção de máquinas de informática, FHD manutenção de máquinas de telecomunicações, FHD manutenção de máquinas de energia, FHD manutenção de máquinas de petróleo, FHD manutenção de máquinas de gás, FHD manutenção de máquinas de água, FHD manutenção de máquinas de esgoto, FHD manutenção de máquinas de tratamento de resíduos, FHD manutenção de máquinas de reciclagem, FHD manutenção de máquinas de compostagem, FHD manutenção de máquinas de incineração, FHD manutenção de máquinas de aterro sanitário, FHD manutenção de máquinas de coleta de lixo, FHD manutenção de máquinas de varrição, FHD manutenção de máquinas de limpeza urbana, FHD manutenção de máquinas de iluminação pública, FHD manutenção de máquinas de sinalização, FHD manutenção de máquinas de segurança, FHD manutenção de máquinas de vigilância, FHD manutenção de máquinas de controle de acesso, FHD manutenção de máquinas de alarme, FHD manutenção de máquinas de sprinkler, FHD manutenção de máquinas de extintor, FHD manutenção de máquinas de hidrante, FHD manutenção de máquinas de bombeiro, FHD manutenção de máquinas de ambulância, FHD manutenção de máquinas de polícia, FHD manutenção de máquinas de exército, FHD manutenção de máquinas de marinha, FHD manutenção de máquinas de aeronáutica, FHD manutenção de máquinas de aviação, FHD manutenção de máquinas de navegação, FHD manutenção de máquinas de transporte, FHD manutenção de máquinas de logística, FHD manutenção de máquinas de armazenagem, FHD manutenção de máquinas de movimentação, FHD manutenção de máquinas de elevação, FHD manutenção de máquinas de guincho, FHD manutenção de máquinas de empilhadeira, FHD manutenção de máquinas de ponte rolante, FHD manutenção de máquinas de talha, FHD manutenção de máquinas de monoviga, FHD manutenção de máquinas de pórtico, FHD manutenção de máquinas de carro ponte, FHD manutenção de máquinas de carro trolley, FHD manutenção de máquinas de carro principal, FHD manutenção de máquinas de carro secundário, FHD manutenção de máquinas de carro de elevação, FHD manutenção de máquinas de carro de translação, FHD manutenção de máquinas de carro de rotação, FHD manutenção de máquinas de carro de inclinação, FHD manutenção de máquinas de carro de oscilação, FHD manutenção de máquinas de carro de vibração, FHD manutenção de máquinas de carro de impacto, FHD manutenção de máquinas de carro de compressão, FHD manutenção de máquinas de carro de tração, FHD manutenção de máquinas de carro de torção, FHD manutenção de máquinas de carro de flexão, FHD manutenção de máquinas de carro de cisalhamento, FHD manutenção de máquinas de carro de corte, FHD manutenção de máquinas de carro de dobra, FHD manutenção de máquinas de carro de calandra, FHD manutenção de máquinas de carro de laminador, FHD manutenção de máquinas de carro de trefilador, FHD manutenção de máquinas de carro de extrusor, FHD manutenção de máquinas de carro de injetor, FHD manutenção de máquinas de carro de soprador, FHD manutenção de máquinas de carro de termoformador, FHD manutenção de máquinas de carro de rotomoldador, FHD manutenção de máquinas de carro de calandrador, FHD manutenção de máquinas de carro de laminador, FHD manutenção de máquinas de carro de trefilador, FHD manutenção de máquinas de carro de extrusor, FHD manutenção de máquinas de carro de injetor, FHD manutenção de máquinas de carro de soprador, FHD manutenção de máquinas de carro de termoformador, FHD manutenção de máquinas de carro de rotomoldador, sobre FHD Automação, história empresa FHD, automação industrial FHD, missão visão valores FHD, equipe especializada FHD, FHD Automação história, empresa automação FHD, especialistas hidráulica FHD, especialistas pneumática FHD, equipe técnica FHD, história da FHD, fundação FHD, empresa FHD Sumaré, FHD São Paulo, FHD Brasil, São Paulo, SP, Brasil',
        canonical_url: 'https://fhdautomacao.com.br/quem-somos'
      },
      services: {
        title: 'Nossos Serviços - FHD Automação Industrial',
        description: 'Conheça todos os serviços da FHD Automação Industrial: automação hidráulica e pneumática, projetos personalizados, manutenção especializada e muito mais.',
        keywords: 'serviços automação industrial, manutenção hidráulica, projetos pneumáticos, instalação tubulações, fabricação unidades hidráulicas, manutenção de cilindros, manutenção de válvulas, manutenção de bombas, automação hidráulica, automação pneumática, projetos hidráulicos, projetos pneumáticos, instalação hidráulica, instalação pneumática, fabricação hidráulica, reparo cilindros, reparo válvulas, reparo bombas, manutenção preventiva hidráulica, manutenção preventiva pneumática',
        canonical_url: 'https://fhdautomacao.com.br/servicos'
      },
      contact: {
        title: 'Contato - FHD Automação Industrial',
        description: 'Entre em contato com a FHD Automação Industrial. Telefone: (19) 99865-2144. E-mail: comercial@fhdautomacao.com.br. Endereço em Sumaré, SP.',
        keywords: 'contato FHD Automação, telefone automação industrial, endereço Sumaré SP, orçamento hidráulica pneumática, contato automação industrial, telefone FHD Automação, endereço FHD Automação, orçamento automação, contato hidráulica, contato pneumática',
        canonical_url: 'https://fhdautomacao.com.br/contato'
      },
      clients: {
        title: 'FHD Automação Industrial - Nossos Clientes',
        description: 'Conheça os clientes satisfeitos da FHD Automação Industrial e os projetos de sucesso que realizamos em automação hidráulica e pneumática.',
        keywords: 'clientes, projetos, automação industrial, hidráulica, pneumática, cases de sucesso, clientes FHD Automação, projetos realizados, cases automação industrial, projetos hidráulicos realizados, projetos pneumáticos realizados, clientes satisfeitos automação',
        canonical_url: 'https://fhdautomacao.com.br/clientes'
      },
      quotation: {
        title: 'Solicitar Orçamento - FHD Automação Industrial',
        description: 'Solicite seu orçamento personalizado para projetos de automação industrial, sistemas hidráulicos e pneumáticos. Resposta em até 24 horas.',
        keywords: 'orçamento automação industrial, cotação hidráulica, preço pneumática, solicitar orçamento, orçamento hidráulica, orçamento pneumática, cotação automação, preço automação industrial, orçamento cilindros, orçamento válvulas, orçamento bombas, orçamento unidades hidráulicas',
        canonical_url: 'https://fhdautomacao.com.br/orcamento'
      },
      'product-detail': {
        title: 'Produto - FHD Automação Industrial',
        description: 'Conheça nossos produtos de automação industrial. Qualidade e garantia em hidráulica e pneumática.',
        keywords: 'produtos automação industrial, produtos hidráulica, produtos pneumática, cilindros hidráulicos, válvulas hidráulicas, bombas hidráulicas, unidades hidráulicas, cilindros pneumáticos, válvulas pneumáticas, bombas pneumáticas, produtos FHD Automação',
        canonical_url: 'https://fhdautomacao.com.br/produto',
        robots: 'index, follow'
      },
      'service-detail': {
        title: 'Serviço - FHD Automação Industrial',
        description: 'Conheça nossos serviços de automação industrial. Especialistas em hidráulica e pneumática.',
        keywords: 'serviços automação industrial, serviços hidráulica, serviços pneumática, manutenção hidráulica, manutenção pneumática, projetos hidráulicos, projetos pneumáticos, instalação hidráulica, instalação pneumática, reparo hidráulica, reparo pneumática, serviços FHD Automação',
        canonical_url: 'https://fhdautomacao.com.br/servico',
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
