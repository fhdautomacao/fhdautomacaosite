import React from 'react'

const LocalBusinessSchema = () => {
  const localBusinessData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "FHD Automação Industrial",
    "alternateName": "FHD",
    "description": "FHD Automação Industrial: Especialistas em manutenção de máquinas industriais, fabricação de unidades hidráulicas, venda de peças hidráulicas e pneumáticas. Mais de 10 anos de experiência em Sumaré, SP.",
    "url": "https://fhdautomacao.com.br",
    "logo": "https://fhdautomacao.com.br/logo.png",
    "image": "https://fhdautomacao.com.br/og-image.jpg",
    "telephone": "+55-19-99865-2144",
    "email": "comercial@fhdautomacao.com.br",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Sumaré",
      "addressLocality": "Sumaré",
      "addressRegion": "SP",
      "postalCode": "13170-000",
      "addressCountry": "BR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "-22.8219",
      "longitude": "-47.2668"
    },
    "openingHoursSpecification": [
      {
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
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "08:00",
        "closes": "12:00"
      }
    ],
    "priceRange": "$$",
    "paymentAccepted": [
      "Cash",
      "Credit Card",
      "Bank Transfer",
      "PIX"
    ],
    "currenciesAccepted": "BRL",
    "areaServed": [
      {
        "@type": "City",
        "name": "Sumaré"
      },
      {
        "@type": "City",
        "name": "Campinas"
      },
      {
        "@type": "City",
        "name": "Hortolândia"
      },
      {
        "@type": "City",
        "name": "Nova Odessa"
      },
      {
        "@type": "City",
        "name": "Americana"
      },
      {
        "@type": "City",
        "name": "Santa Bárbara d'Oeste"
      },
      {
        "@type": "City",
        "name": "Piracicaba"
      },
      {
        "@type": "City",
        "name": "Limeira"
      },
      {
        "@type": "City",
        "name": "Indaiatuba"
      },
      {
        "@type": "City",
        "name": "Itu"
      },
      {
        "@type": "City",
        "name": "Salto"
      },
      {
        "@type": "City",
        "name": "Jundiaí"
      },
      {
        "@type": "City",
        "name": "Valinhos"
      },
      {
        "@type": "City",
        "name": "Vinhedo"
      },
      {
        "@type": "City",
        "name": "Louveira"
      },
      {
        "@type": "City",
        "name": "Jaguariúna"
      },
      {
        "@type": "City",
        "name": "Pedreira"
      },
      {
        "@type": "City",
        "name": "Amparo"
      },
      {
        "@type": "City",
        "name": "Monte Alegre do Sul"
      },
      {
        "@type": "City",
        "name": "Socorro"
      },
      {
        "@type": "City",
        "name": "Águas de Lindóia"
      },
      {
        "@type": "City",
        "name": "Lindóia"
      },
      {
        "@type": "City",
        "name": "Serra Negra"
      },
      {
        "@type": "City",
        "name": "Holambra"
      },
      {
        "@type": "City",
        "name": "Artur Nogueira"
      },
      {
        "@type": "City",
        "name": "Engenheiro Coelho"
      },
      {
        "@type": "City",
        "name": "Mogi Mirim"
      },
      {
        "@type": "City",
        "name": "Mogi Guaçu"
      },
      {
        "@type": "City",
        "name": "Conchal"
      },
      {
        "@type": "City",
        "name": "Araras"
      },
      {
        "@type": "City",
        "name": "Leme"
      },
      {
        "@type": "City",
        "name": "Rio Claro"
      },
      {
        "@type": "City",
        "name": "São Carlos"
      },
      {
        "@type": "City",
        "name": "Araraquara"
      },
      {
        "@type": "City",
        "name": "Ribeirão Preto"
      },
      {
        "@type": "City",
        "name": "São Paulo"
      }
    ],
    "serviceArea": {
      "@type": "State",
      "name": "São Paulo"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Serviços FHD Automação Industrial",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Manutenção de Máquinas Industriais",
            "description": "Serviços especializados de manutenção para diversos tipos de máquinas industriais"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Fabricação de Unidades Hidráulicas",
            "description": "Fabricação personalizada de unidades hidráulicas industriais"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Venda de Peças Hidráulicas",
            "description": "Venda de peças e componentes hidráulicos para máquinas industriais"
          }
        }
      ]
    },
    "sameAs": [
      "https://www.linkedin.com/company/fhd-automacao",
      "https://www.facebook.com/fhdautomacao",
      "https://www.instagram.com/fhdautomacao"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "150",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Cliente Satisfeito"
        },
        "reviewBody": "Excelente serviço de manutenção de máquinas industriais. Equipe muito profissional e competente."
      },
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Empresa Industrial"
        },
        "reviewBody": "A FHD Automação resolveu nossos problemas com unidades hidráulicas de forma rápida e eficiente."
      },
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Indústria Metalúrgica"
        },
        "reviewBody": "Melhor empresa de manutenção industrial que já contratamos. Recomendo fortemente!"
      }
    ]
  }

  return (
    <script type="application/ld+json">
      {JSON.stringify(localBusinessData)}
    </script>
  )
}

export default LocalBusinessSchema
