// Geração de Open Graph dinâmico usando @vercel/og (quando hospedado na Vercel)
// Não altera UI; apenas fornece imagem social em /api/og?title=...&subtitle=...

export const config = {
  runtime: 'edge'
}

export default async function handler(req) {
  try {
    const { searchParams } = new URL(req.url)
    const title = searchParams.get('title') || 'FHD Automação Industrial'
    const subtitle = searchParams.get('subtitle') || 'Soluções Hidráulicas e Pneumáticas'

    const font = await fetch('https://og.playground.edge.vercel.app/inter-latin-ext-700-normal.woff').then(r => r.arrayBuffer())

    // @ts-ignore
    const { ImageResponse } = await import('@vercel/og')
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            background: 'linear-gradient(135deg,#0ea5e9,#1e3a8a)',
            padding: '60px',
            color: '#fff'
          }}
        >
          <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.1, maxWidth: 1000 }}>{title}</div>
          <div style={{ fontSize: 28, marginTop: 20, opacity: 0.9 }}>{subtitle}</div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [{ name: 'Inter', data: font, weight: 700 }]
      }
    )
  } catch (e) {
    return new Response('OG error', { status: 500 })
  }
}


