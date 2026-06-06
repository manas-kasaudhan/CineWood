/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Professional Palette ───────────────────────
        cream:    '#E8E9ED',
        primary:  '#E11D48',
        'primary-dark': '#BE123C',
        'primary-light': '#FB7185',
        accent:   '#3DD598',
        'accent-dark': '#2DBF84',
        'accent-light': '#5EEDB0',
        amber:    '#F5A623',
        'amber-dark': '#D9901A',
        'amber-light': '#FFB94D',
        // ── Background & Surface ─────────────────────
        noir:     '#1C1917',
        'noir-light': '#292524',
        'noir-mid': '#44403C',
        surface:  '#292524',
        slate:    '#44403C',
        // ── Legacy aliases for compatibility ─────────
        coral:    '#E11D48',
        'coral-dark': '#BE123C',
        'coral-light': '#FB7185',
        teal:     '#3DD598',
        'teal-dark': '#2DBF84',
        'teal-light': '#5EEDB0',
        sun:      '#F5A623',
        'sun-dark': '#D9901A',
        violet:   '#E11D48',
        'violet-dark': '#BE123C',
        lavender: '#E11D48',
        'lavender-dark': '#BE123C',
        peach:    '#F5A623',
        'peach-dark': '#D9901A',
        mist:     '#3DD598',
        mint:     '#3DD598',
        'mint-dark': '#2DBF84',
        dusty:    '#E11D48',
        muted:    '#8B8D98',
        navy:     '#1C1917',
        'navy-light': '#292524',
        'navy-mid': '#44403C',
        frost:    'rgba(255,255,255,0.06)',
        'frost-mid': 'rgba(255,255,255,0.10)',
        'frost-high': 'rgba(255,255,255,0.16)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'float': 'float 8s ease-in-out infinite',
        'float-slow': 'float 12s ease-in-out infinite',
        'float-fast': 'float 5s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'typing': 'typing 1.5s steps(30, end)',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'card':        '0 4px 24px rgba(0,0,0,0.3)',
        'card-hover':  '0 12px 40px rgba(0,0,0,0.5)',
        'elevated':    '0 8px 32px rgba(0,0,0,0.4)',
        'soft':        '0 2px 12px rgba(0,0,0,0.2)',
      },
    },
  },
  plugins: [],
}
