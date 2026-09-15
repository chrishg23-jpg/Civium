export const civiumTheme = {
  colors: {
    background: '#0b1020',
    surface: '#141a33',
    surfaceAlt: '#1b2340',
    border: '#2b3558',
    text: '#f5f7ff',
    textMuted: '#a5b0d8',
    accent: '#4f8cff',
    accentSoft: '#243b73',
    danger: '#ff4f6b',
    success: '#3dd68c',
    warning: '#ffb74f',

    tierHousehold: '#4f8cff',
    tierNeighbourhood: '#3dd68c',
    tierCity: '#ffb74f'
  },
  radii: {
    sm: '6px',
    md: '10px',
    lg: '16px'
  },
  shadows: {
    soft: '0 8px 20px rgba(0, 0, 0, 0.35)'
  },
  spacing: (factor: number) => `${factor * 8}px`,
  font: {
    family: `'system-ui', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
    sizeBase: '14px',
    sizeSm: '12px',
    sizeLg: '16px',
    sizeXl: '20px'
  }
};
