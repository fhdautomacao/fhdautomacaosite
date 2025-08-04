import { Helmet } from 'react-helmet-async'
import Clients from '@/components/sections/Clients'

const ClientsPage = () => {
  return (
    <>
      <Helmet>
        <title>FHD Automação Industrial - Nossos Clientes</title>
        <meta 
          name="description" 
          content="Conheça os clientes satisfeitos da FHD Automação Industrial e os projetos de sucesso que realizamos em automação hidráulica e pneumática." 
        />
        <meta 
          name="keywords" 
          content="clientes, projetos, automação industrial, hidráulica, pneumática, cases de sucesso" 
        />
        <meta name="author" content="FHD Automação Industrial" />
        <meta property="og:title" content="FHD Automação Industrial - Nossos Clientes" />
        <meta 
          property="og:description" 
          content="Conheça os clientes satisfeitos da FHD Automação Industrial e os projetos de sucesso que realizamos." 
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fhdautomacao.com.br/clientes" />
        <meta property="og:image" content="https://fhdautomacao.com.br/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FHD Automação Industrial - Nossos Clientes" />
        <meta 
          name="twitter:description" 
          content="Conheça os clientes satisfeitos da FHD Automação Industrial e os projetos de sucesso que realizamos." 
        />
        <link rel="canonical" href="https://fhdautomacao.com.br/clientes" />
      </Helmet>
      <Clients />
    </>
  )
}

export default ClientsPage


