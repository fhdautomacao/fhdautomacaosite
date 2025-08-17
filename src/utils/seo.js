// Structured Data Templates
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "FHD Automação Industrial",
  "description": "Especialistas em automação industrial, hidráulica e pneumática",
  "url": "https://www.fhdautomacaoindustrial.com.br",
  "logo": "https://www.fhdautomacaoindustrial.com.br/logo.png",
  "foundingDate": "2013",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+55-19-99865-2144",
    "contactType": "customer service",
    "email": "comercial@fhdautomacao.com.br",
    "availableLanguage": "Portuguese"
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
  ],
  "areaServed": {
    "@type": "GeoCircle",
    "geoMidpoint": {
      "@type": "GeoCoordinates",
      "latitude": -22.8219,
      "longitude": -47.2669
    },
    "geoRadius": "100000"
  }
}

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "FHD Automação Industrial",
  "image": "https://www.fhdautomacaoindustrial.com.br/logo.png",
  "telephone": "+55-19-99865-2144",
  "email": "comercial@fhdautomacao.com.br",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "R. João Ediberti Biondo, 336",
    "addressLocality": "Sumaré",
    "addressRegion": "SP",
    "postalCode": "13171-446",
    "addressCountry": "BR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": -22.8219,
    "longitude": -47.2669
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "Monday",
      "Tuesday", 
      "Wednesday",
      "Thursday",
      "Friday"
    ],
    "opens": "08:00",
    "closes": "18:00"
  },
  "priceRange": "$$"
}

export const serviceSchema = (serviceName, description) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "name": serviceName,
  "description": description,
  "provider": {
    "@type": "Organization",
    "name": "FHD Automação Industrial",
    "url": "https://www.fhdautomacaoindustrial.com.br"
  },
  "areaServed": {
    "@type": "Place",
    "name": "São Paulo, Brasil"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Serviços de Automação Industrial",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": serviceName
        }
      }
    ]
  }
})

export const breadcrumbSchema = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
})

// SEO Meta Tags Generator
export const generateMetaTags = (page) => {
  const baseTags = {
    title: "FHD Automação Industrial - Soluções Hidráulicas e Pneumáticas",
    description: "FHD Automação Industrial oferece soluções completas em automação hidráulica e pneumática. Mais de 10 anos de experiência, 500+ projetos realizados e 98% de satisfação dos clientes.",
    keywords: "automação industrial, hidráulica, pneumática, cilindros hidráulicos, bombas hidráulicas, válvulas, unidades hidráulicas, manutenção industrial, Sumaré, São Paulo"
  }

  const pageTags = {
    home: {
      title: "FHD Automação Industrial - Soluções Hidráulicas e Pneumáticas",
      description: "Especialistas em automação industrial com mais de 10 anos de experiência. Oferecemos soluções completas para suas necessidades hidráulicas e pneumáticas em Sumaré, SP.",
      keywords: "automação industrial, hidráulica, pneumática, cilindros hidráulicos, bombas hidráulicas, válvulas, unidades hidráulicas, manutenção industrial, Sumaré, São Paulo, FHD"
    },
    about: {
      title: "Quem Somos - FHD Automação Industrial",
      description: "Conheça a história da FHD Automação Industrial. Mais de 10 anos de experiência em soluções hidráulicas e pneumáticas, com sede em Sumaré, SP.",
      keywords: "sobre FHD Automação, história empresa, automação industrial Sumaré, missão visão valores, equipe especializada"
    },
    services: {
      title: "Nossos Serviços - FHD Automação Industrial",
      description: "Conheça todos os serviços da FHD Automação Industrial: automação hidráulica e pneumática, projetos personalizados, manutenção especializada e muito mais.",
      keywords: "serviços automação industrial, manutenção hidráulica, projetos pneumáticos, instalação tubulações, fabricação unidades hidráulicas"
    },
    contact: {
      title: "Contato - FHD Automação Industrial",
      description: "Entre em contato com a FHD Automação Industrial. Telefone: (19) 99865-2144. E-mail: comercial@fhdautomacao.com.br. Endereço em Sumaré, SP.",
      keywords: "contato FHD Automação, telefone automação industrial, endereço Sumaré SP, orçamento hidráulica pneumática"
    }
  }

  return pageTags[page] || baseTags
}

// URL Canonicalization
export const getCanonicalUrl = (path) => {
  const baseUrl = "https://www.fhdautomacaoindustrial.com.br"
  return path === "/" ? baseUrl : `${baseUrl}${path}`
}

