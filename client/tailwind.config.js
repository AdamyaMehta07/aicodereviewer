/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        base: {
          950: '#05070D',
          900: '#0A0E17',
          850: '#0D1220',
          800: '#11172A',
          700: '#1A2238',
        },
        line: {
          800: '#1E2740',
          700: '#2A3552',
        },
        ink: {
          100: '#F4F6FB',
          300: '#B7C0D8',
          500: '#7C88A8',
          700: '#4C5878',
        },
        accent: {
          violet: '#7C5CFF',
          cyan: '#3FE0D0',
          amber: '#FFB454',
          rose: '#FF6B81',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'grid-fade':
          'linear-gradient(to bottom, rgba(124,92,255,0.08), transparent 60%)',
        'aurora':
          'radial-gradient(60% 50% at 20% 0%, rgba(124,92,255,0.25), transparent), radial-gradient(50% 40% at 90% 10%, rgba(63,224,208,0.18), transparent)',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.35)',
        glow: '0 0 0 1px rgba(124,92,255,0.4), 0 0 24px rgba(124,92,255,0.25)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
};
