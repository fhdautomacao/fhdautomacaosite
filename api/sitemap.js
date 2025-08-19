import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req, res) {
  try {
    // Configurar headers para XML e SEO
    res.setHeader('Content-Type', 'application/xml; charset=utf-8')
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600')
    res.setHeader('X-Robots-Tag', 'noindex')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    // URLs estáticas principais
    const staticUrls = [
      {
        loc: 'https://www.fhdautomacaoindustrial.com.br/',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'daily',
        priority: '1.0'
      },
      {
        loc: 'https://www.fhdautomacaoindustrial.com.br/quem-somos',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: '0.9'
      },
      {
        loc: 'https://www.fhdautomacaoindustrial.com.br/servicos',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: '0.9'
      },
      {
        loc: 'https://www.fhdautomacaoindustrial.com.br/produtos',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: '0.9'
      },
      {
        loc: 'https://www.fhdautomacaoindustrial.com.br/clientes',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: '0.8'
      },
      {
        loc: 'https://www.fhdautomacaoindustrial.com.br/contato',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: '0.8'
      },
      {
        loc: 'https://www.fhdautomacaoindustrial.com.br/orcamento',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: '0.9'
      },
      {
        loc: 'https://www.fhdautomacaoindustrial.com.br/termos-de-uso',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'yearly',
        priority: '0.3'
      },
      {
        loc: 'https://www.fhdautomacaoindustrial.com.br/politica-de-privacidade',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'yearly',
        priority: '0.3'
      }
    ]

    // Buscar serviços ativos (com timeout)
    let serviceUrls = []
    try {
      const servicesPromise = supabase
        .from('services')
        .select('slug, updated_at')
        .eq('is_active', true)
      
      const servicesResult = await Promise.race([
        servicesPromise,
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 5000)
        )
      ])
      
      if (servicesResult.data) {
        serviceUrls = servicesResult.data.map(service => ({
          loc: `https://www.fhdautomacaoindustrial.com.br/servico/${service.slug}`,
          lastmod: service.updated_at ? new Date(service.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          changefreq: 'weekly',
          priority: '0.8'
        }))
      }
    } catch (error) {
      console.warn('Erro ao buscar serviços (usando fallback):', error.message)
    }

    // Buscar produtos ativos (com timeout)
    let productUrls = []
    try {
      const productsPromise = supabase
        .from('products')
        .select('slug, updated_at')
        .eq('is_active', true)
      
      const productsResult = await Promise.race([
        productsPromise,
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 5000)
        )
      ])
      
      if (productsResult.data) {
        productUrls = productsResult.data.map(product => ({
          loc: `https://www.fhdautomacaoindustrial.com.br/produto/${product.slug}`,
          lastmod: product.updated_at ? new Date(product.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          changefreq: 'weekly',
          priority: '0.8'
        }))
      }
    } catch (error) {
      console.warn('Erro ao buscar produtos (usando fallback):', error.message)
    }

    // Combinar todas as URLs
    const allUrls = [...staticUrls, ...serviceUrls, ...productUrls]

    // Gerar XML do sitemap com formatação otimizada
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`

    // Log para debug
    console.log(`✅ Sitemap gerado com ${allUrls.length} URLs`)
    console.log(`📅 Data atual: ${new Date().toISOString().split('T')[0]}`)

    res.status(200).send(sitemapXml)
  } catch (error) {
    console.error('❌ Erro ao gerar sitemap:', error)
    
    // Fallback: sitemap básico em caso de erro
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.fhdautomacaoindustrial.com.br/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`
    
    res.setHeader('Content-Type', 'application/xml; charset=utf-8')
    res.status(200).send(fallbackXml)
  }
}
