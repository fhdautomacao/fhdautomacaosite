import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req, res) {
  try {
    // Configurar headers para XML
    res.setHeader('Content-Type', 'application/xml')
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600')

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

    // Buscar serviços ativos
    let serviceUrls = []
    try {
      const { data: services } = await supabase
        .from('services')
        .select('slug, updated_at')
        .eq('is_active', true)
      
      if (services) {
        serviceUrls = services.map(service => ({
          loc: `https://www.fhdautomacaoindustrial.com.br/servico/${service.slug}`,
          lastmod: service.updated_at ? new Date(service.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          changefreq: 'weekly',
          priority: '0.8'
        }))
      }
    } catch (error) {
      console.warn('Erro ao buscar serviços:', error)
    }

    // Buscar produtos ativos
    let productUrls = []
    try {
      const { data: products } = await supabase
        .from('products')
        .select('slug, updated_at')
        .eq('is_active', true)
      
      if (products) {
        productUrls = products.map(product => ({
          loc: `https://www.fhdautomacaoindustrial.com.br/produto/${product.slug}`,
          lastmod: product.updated_at ? new Date(product.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          changefreq: 'weekly',
          priority: '0.8'
        }))
      }
    } catch (error) {
      console.warn('Erro ao buscar produtos:', error)
    }

    // Combinar todas as URLs
    const allUrls = [...staticUrls, ...serviceUrls, ...productUrls]

    // Gerar XML do sitemap
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`

    res.status(200).send(sitemapXml)
  } catch (error) {
    console.error('Erro ao gerar sitemap:', error)
    res.status(500).send('Erro interno do servidor')
  }
}
