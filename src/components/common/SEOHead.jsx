import { Helmet } from 'react-helmet-async'

const SEOHead = ({ 
  title, 
  description, 
  keywords, 
  canonical, 
  ogImage = "https://fhdautomacao.com.br/og-image.jpg",
  structuredData 
}) => {
  const defaultTitle = "FHD Automação Industrial - Soluções Hidráulicas e Pneumáticas"
  const defaultDescription = "FHD Automação Industrial oferece soluções completas em automação hidráulica e pneumática. Mais de 10 anos de experiência, 500+ projetos realizados e 98% de satisfação dos clientes."
  const defaultKeywords = "automação industrial, hidráulica, pneumática, cilindros hidráulicos, bombas hidráulicas, válvulas, unidades hidráulicas, manutenção industrial, Sumaré, São Paulo"

  const finalTitle = title ? `${title} - FHD Automação Industrial` : defaultTitle
  const finalDescription = description || defaultDescription
  const finalKeywords = keywords || defaultKeywords

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="author" content="FHD Automação Industrial" />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Open Graph */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical || "https://fhdautomacao.com.br"} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="FHD Automação Industrial" />
      <meta property="og:locale" content="pt_BR" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  )
}

export default SEOHead

