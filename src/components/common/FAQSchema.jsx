import React from 'react'

const FAQSchema = () => {
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "A FHD Automação Industrial faz manutenção de máquinas industriais?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim! A FHD Automação Industrial é especializada em manutenção de máquinas industriais. Oferecemos serviços de manutenção preventiva, corretiva e preditiva para diversos tipos de máquinas industriais, incluindo prensas hidráulicas, injetoras, extrusoras, máquinas CNC e muito mais."
        }
      },
      {
        "@type": "Question",
        "name": "Vocês fabricam unidades hidráulicas?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim! A FHD Automação Industrial fabrica unidades hidráulicas personalizadas para diferentes aplicações industriais. Nossas unidades são projetadas e fabricadas com os mais altos padrões de qualidade e podem ser adaptadas às necessidades específicas de cada cliente."
        }
      },
      {
        "@type": "Question",
        "name": "Vendem peças hidráulicas?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim! A FHD Automação Industrial comercializa uma ampla variedade de peças hidráulicas e pneumáticas, incluindo cilindros, válvulas, bombas, motores, atuadores e outros componentes para sistemas hidráulicos e pneumáticos industriais."
        }
      },
      {
        "@type": "Question",
        "name": "Qual a área de atendimento da FHD Automação?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A FHD Automação Industrial atende principalmente a região de Sumaré e Campinas, no estado de São Paulo. Nossa equipe técnica está preparada para atender clientes em toda a região metropolitana de Campinas e áreas adjacentes."
        }
      },
      {
        "@type": "Question",
        "name": "Vocês fazem manutenção de sistemas hidráulicos?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim! A FHD Automação Industrial oferece serviços especializados de manutenção de sistemas hidráulicos, incluindo diagnóstico, reparo, substituição de componentes e otimização de performance para garantir o funcionamento eficiente dos sistemas."
        }
      },
      {
        "@type": "Question",
        "name": "Fazem manutenção de sistemas pneumáticos?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim! Além dos sistemas hidráulicos, a FHD Automação Industrial também oferece serviços de manutenção de sistemas pneumáticos, incluindo manutenção de compressores, válvulas pneumáticas, atuadores e outros componentes pneumáticos."
        }
      },
      {
        "@type": "Question",
        "name": "Vocês fazem manutenção de prensas hidráulicas?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim! A FHD Automação Industrial é especializada em manutenção de prensas hidráulicas. Nossa equipe técnica possui vasta experiência em diagnosticar e reparar problemas em prensas hidráulicas de diferentes capacidades e aplicações."
        }
      },
      {
        "@type": "Question",
        "name": "Fazem manutenção de injetoras?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim! A FHD Automação Industrial oferece serviços de manutenção para injetoras, incluindo manutenção dos sistemas hidráulicos, pneumáticos e elétricos das máquinas injetoras de plástico."
        }
      },
      {
        "@type": "Question",
        "name": "Vocês fazem manutenção de extrusoras?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim! A FHD Automação Industrial oferece serviços de manutenção para extrusoras, incluindo manutenção dos sistemas de acionamento, controle de temperatura, sistemas hidráulicos e pneumáticos das extrusoras."
        }
      },
      {
        "@type": "Question",
        "name": "Fazem manutenção de máquinas CNC?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim! A FHD Automação Industrial oferece serviços de manutenção para máquinas CNC, incluindo manutenção dos sistemas hidráulicos, pneumáticos, lubrificação e outros sistemas auxiliares das máquinas CNC."
        }
      },
      {
        "@type": "Question",
        "name": "Qual o tempo de resposta para manutenção?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A FHD Automação Industrial prioriza o atendimento rápido aos clientes. Para manutenções emergenciais, nossa equipe técnica está preparada para responder em até 24 horas, dependendo da localização e complexidade do serviço."
        }
      },
      {
        "@type": "Question",
        "name": "Vocês oferecem garantia nos serviços?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim! A FHD Automação Industrial oferece garantia em todos os serviços de manutenção e produtos fabricados. Nossa garantia cobre defeitos de fabricação e instalação, proporcionando tranquilidade aos nossos clientes."
        }
      },
      {
        "@type": "Question",
        "name": "Fazem orçamentos gratuitos?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim! A FHD Automação Industrial oferece orçamentos gratuitos para todos os nossos serviços. Nossa equipe técnica visita o local para avaliar as necessidades e apresentar a melhor solução para cada caso."
        }
      },
      {
        "@type": "Question",
        "name": "Vocês trabalham com quais marcas de equipamentos?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A FHD Automação Industrial trabalha com as principais marcas do mercado, incluindo Bosch Rexroth, Parker, Eaton, Danfoss, Sauer-Danfoss, Kawasaki, Yuken, Vickers e outras marcas reconhecidas no setor hidráulico e pneumático."
        }
      },
      {
        "@type": "Question",
        "name": "Qual a experiência da FHD Automação no mercado?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A FHD Automação Industrial possui mais de 10 anos de experiência no mercado de automação industrial. Nossa equipe técnica é altamente qualificada e possui vasta experiência em manutenção de máquinas industriais e sistemas hidráulicos e pneumáticos."
        }
      }
    ]
  }

  return (
    <script type="application/ld+json">
      {JSON.stringify(faqData)}
    </script>
  )
}

export default FAQSchema
