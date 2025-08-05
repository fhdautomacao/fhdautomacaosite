import { Helmet } from 'react-helmet-async'
import Hero from '@/components/sections/HeroImproved'
import About from '@/components/sections/AboutImproved'
import Services from '@/components/sections/ServicesImproved'
import Products from '@/components/sections/Products'
import Gallery from '@/components/sections/Gallery'
import Clients from '@/components/sections/Clients'
import Contact from '@/components/sections/Contact'

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>FHD Automação Industrial - Soluções Hidráulicas e Pneumáticas</title>
        <meta 
          name="description" 
          content="FHD Automação Industrial oferece soluções completas em automação hidráulica e pneumática. Mais de 10 anos de experiência, 500+ projetos realizados e 98% de satisfação dos clientes." 
        />
        <meta 
          name="keywords" 
          content="automação industrial, hidráulica, pneumática, cilindros hidráulicos, bombas hidráulicas, válvulas, unidades hidráulicas, manutenção industrial, Sumaré, São Paulo" 
        />
        <meta name="author" content="FHD Automação Industrial" />
        <meta property="og:title" content="FHD Automação Industrial - Soluções Hidráulicas e Pneumáticas" />
        <meta 
          property="og:description" 
          content="Especialistas em automação industrial com mais de 10 anos de experiência. Oferecemos soluções completas para suas necessidades hidráulicas e pneumáticas." 
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fhdautomacao.com.br" />
        <meta property="og:image" content="https://fhdautomacao.com.br/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FHD Automação Industrial - Soluções Hidráulicas e Pneumáticas" />
        <meta 
          name="twitter:description" 
          content="Especialistas em automação industrial com mais de 10 anos de experiência. Oferecemos soluções completas para suas necessidades hidráulicas e pneumáticas." 
        />
        <link rel="canonical" href="https://fhdautomacao.com.br" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "FHD Automação Industrial",
            "description": "Especialistas em automação industrial, hidráulica e pneumática",
            "url": "https://fhdautomacao.com.br",
            "logo": "https://fhdautomacao.com.br/logo.png",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+55-19-99865-2144",
              "contactType": "customer service",
              "email": "comercial@fhdautomacao.com.br"
            },
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "R. João Ediberti Biondo, 336",
              "addressLocality": "Sumaré",
              "addressRegion": "SP",
              "postalCode": "13171-446",
              "addressCountry": "BR"
            },
            "sameAs": [
              "https://www.linkedin.com/company/fhd-automacao",
              "https://www.instagram.com/fhdautomacao"
            ]
          })}
        </script>
      </Helmet>
      
      <main>
        <Hero />
        <About />
        <Services />
        <Products />
        <Gallery />
        <Clients />
        <Contact />
      </main>
    </>
  )
}

export default HomePage
