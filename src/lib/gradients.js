// Gradientes de produção (ajustáveis). Centralizamos aqui para garantir
// consistência entre ambientes e facilitar fine-tuning.

export const tileGradients = {
  desktop: {
    blue: { from: '#1E40AF', to: '#2563EB', border: 'rgba(255,255,255,0.18)' },
    yellow: { from: '#F59E0B', to: '#D97706', border: 'rgba(255,255,255,0.18)' },
    green: { from: '#16A34A', to: '#059669', border: 'rgba(255,255,255,0.18)' },
    purple: { from: '#7C3AED', to: '#9333EA', border: 'rgba(255,255,255,0.18)' },
  },
  mobile: {
    blue: { from: '#3B82F6', to: '#2563EB', border: 'rgba(255,255,255,0.20)' },
    yellow: { from: '#F59E0B', to: '#D97706', border: 'rgba(255,255,255,0.20)' },
    green: { from: '#22C55E', to: '#16A34A', border: 'rgba(255,255,255,0.20)' },
    purple: { from: '#A855F7', to: '#7C3AED', border: 'rgba(255,255,255,0.20)' },
  },
  bars: {
    satisfactionTrackDesktop: '#374151',
    satisfactionTrackMobile: 'rgba(0,0,0,0.20)',
    satisfactionFillFrom: '#22C55E',
    satisfactionFillTo: '#3B82F6',
  }
}

export function buildLinearGradient(from, to, angle = 135) {
  return `linear-gradient(${angle}deg, ${from} 0%, ${to} 100%)`
}

// Controles finos de opacidade no desktop (tons mais translúcidos)
export const tileStyle = {
  desktopAlpha: 0.22, // um pouco mais claro/translúcido no desktop
}

export function hexToRgba(hex, alpha) {
  const clean = hex.replace('#', '')
  const bigint = parseInt(clean, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function buildLinearGradientRGBA(fromHex, toHex, alpha = tileStyle.desktopAlpha, angle = 135) {
  const from = hexToRgba(fromHex, alpha)
  const to = hexToRgba(toHex, alpha)
  return buildLinearGradient(from, to, angle)
}


