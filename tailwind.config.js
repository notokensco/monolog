import forms from '@tailwindcss/forms'
import containerQueries from '@tailwindcss/container-queries'
const config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
            mono: ['JetBrains Mono', 'monospace'],
          },
          colors: {
            paper: {
              DEFAULT: '#FAFAFC',
              50: '#FFFFFF',
              100: '#F4F5F8',
              200: '#E8EDFF',
              300: '#F2EAFE',
              border: '#E2E6EF'
            },
            ink: {
              DEFAULT: '#050505',
              card: '#121316',
              surface: '#1D1D1F',
              muted: '#333438',
              border: '#2A2B30',
              accent: '#D9D6E8'
            },
            brand: {
              charcoal: '#141416',
              indigo: '#4F46E5',
              violet: '#7C3AED'
            }
          },
          boxShadow: {
            'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
            'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
            'key-soft': '0 2px 10px rgba(0,0,0,0.04)',
            'glow-aurora': '0 0 50px -10px rgba(199, 210, 254, 0.45)',
          }
        }
      }
    }
config.content = ['./index.html', './src/**/*.{js,css}']
config.plugins = [forms, containerQueries]
export default config
