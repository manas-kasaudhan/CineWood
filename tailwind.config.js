/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream:    '#FAF7F2',
        lavender: '#C4B5FD',
        'lavender-dark': '#7C3AED',
        peach:    '#FECBA1',
        'peach-dark': '#F59E0B',
        mist:     '#BAD0E8',
        dusty:    '#E8A0BF',
        muted:    '#9B8EC4',
        noir:     '#0D0D0F',
        'noir-light': '#1A1A1F',
        'noir-mid': '#141418',
        frost:    'rgba(255,255,255,0.07)',
        'frost-mid': 'rgba(255,255,255,0.12)',
        'frost-high': 'rgba(255,255,255,0.18)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'float-fast': 'float 4s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'grain': 'grain 0.5s steps(1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'typing': 'typing 1.5s steps(30, end)',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(196,181,253,0.3)' },
          '50%': { boxShadow: '0 0 60px rgba(196,181,253,0.7)' },
        },
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-5%, -10%)' },
          '20%': { transform: 'translate(-15%, 5%)' },
          '30%': { transform: 'translate(7%, -25%)' },
          '40%': { transform: 'translate(-5%, 25%)' },
          '50%': { transform: 'translate(-15%, 10%)' },
          '60%': { transform: 'translate(15%, 0%)' },
          '70%': { transform: 'translate(0%, 15%)' },
          '80%': { transform: 'translate(3%, 35%)' },
          '90%': { transform: 'translate(-10%, 10%)' },
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
        'glow-lavender': '0 0 40px rgba(196, 181, 253, 0.4)',
        'glow-peach': '0 0 40px rgba(254, 203, 161, 0.4)',
        'glow-dusty': '0 0 40px rgba(232, 160, 191, 0.4)',
        'card': '0 8px 32px rgba(0,0,0,0.4)',
        'card-hover': '0 20px 60px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
}
