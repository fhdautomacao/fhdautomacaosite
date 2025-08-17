// Utilitário para gerar sitemap dinâmico
import { productsAPI } from '@/api/products'
import { servicesAPI } from '@/api/services'

export const generateSitemap = async () => {
  try {
    // URLs estáticas
    const staticUrls = [
      { url: '/', priority: 1.0, changefreq: 'weekly' },
      { url: '/quem-somos', priority: 0.8, changefreq: 'monthly' },
      { url: '/servicos', priority: 0.9, changefreq: 'weekly' },
      { url: '/clientes', priority: 0.7, changefreq: 'monthly' },
      { url: '/contato', priority: 0.8, changefreq: 'monthly' },
      { url: '/orcamento', priority: 0.9, changefreq: 'weekly' },
      { url: '/termos-de-uso', priority: 0.3, changefreq: 'yearly' },
      { url: '/politica-de-privacidade', priority: 0.3, changefreq: 'yearly' },
    ]

    // URLs dinâmicas de produtos
    let productUrls = []
    try {
      const products = await productsAPI.getAll()
      productUrls = products.map(product => ({
        url: `/produto/${product.slug}`,
        priority: 0.8,
        changefreq: 'monthly',
        lastmod: product.updated_at || new Date().toISOString()
      }))
    } catch (error) {
      console.warn('Erro ao carregar produtos para sitemap:', error)
    }

    // URLs dinâmicas de serviços
    let serviceUrls = []
    try {
      const services = await servicesAPI.getActive()
      serviceUrls = services.map(service => ({
        url: `/servico/${service.slug}`,
        priority: 0.8,
        changefreq: 'monthly',
        lastmod: service.updated_at || new Date().toISOString()
      }))
    } catch (error) {
      console.warn('Erro ao carregar serviços para sitemap:', error)
    }

    // Combinar todas as URLs
    const allUrls = [...staticUrls, ...productUrls, ...serviceUrls]

    // Gerar XML do sitemap
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(url => `  <url>
    <loc>https://www.fhdautomacaoindustrial.com.br${url.url}</loc>
    <lastmod>${url.lastmod || new Date().toISOString()}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`

    return sitemapXml
  } catch (error) {
    console.error('Erro ao gerar sitemap:', error)
    return null
  }
}

// Função para gerar robots.txt
export const generateRobotsTxt = () => {
  return `User-agent: *
Allow: /

# Sitemap
Sitemap: https://www.fhdautomacaoindustrial.com.br/sitemap.xml

# Crawl-delay
Crawl-delay: 1`
}

// Função para gerar dados estruturados da empresa
export const generateOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "FHD Automação Industrial",
    "url": "https://www.fhdautomacaoindustrial.com.br",
    "logo": "https://www.fhdautomacaoindustrial.com.br/logo.png",
    "description": "Especialistas em automação industrial com mais de 10 anos de experiência. Oferecemos soluções completas para suas necessidades hidráulicas e pneumáticas.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Sumaré",
      "addressRegion": "SP",
      "addressCountry": "BR"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+55-19-99865-2144",
      "contactType": "customer service",
      "availableLanguage": "Portuguese"
    },
    "sameAs": [
      "https://www.linkedin.com/company/fhd-automacao",
      "https://www.facebook.com/fhdautomacao"
    ]
  }
}

// Função para gerar dados estruturados de FAQ
export const generateFAQSchema = (faqs) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }
}
