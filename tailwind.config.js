/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── New Casual & Bright Palette ──────────────────
        cream:    '#F0F4FF',
        coral:    '#FF6B6B',
        'coral-dark': '#E63E3E',
        'coral-light': '#FF8E8E',
        sun:      '#FFD93D',
        'sun-dark': '#F5B800',
        teal:     '#4ECDC4',
        'teal-dark': '#2BBDB4',
        'teal-light': '#7EDDD8',
        mint:     '#6BCB77',
        'mint-dark': '#4CAF5A',
        violet:   '#A78BFA',
        'violet-dark': '#7C3AED',
        // ── Background & Surface ─────────────────────────
        navy:     '#0F172A',
        'navy-light': '#1E293B',
        'navy-mid': '#162033',
        slate:    '#334155',
        // ── Legacy aliases for compatibility ─────────────
        lavender: '#A78BFA',
        'lavender-dark': '#7C3AED',
        peach:    '#FFD93D',
        'peach-dark': '#F5B800',
        mist:     '#4ECDC4',
        dusty:    '#FF6B6B',
        muted:    '#64748B',
        noir:     '#0F172A',
        'noir-light': '#1E293B',
        'noir-mid': '#162033',
        frost:    'rgba(255,255,255,0.07)',
        'frost-mid': 'rgba(255,255,255,0.12)',
        'frost-high': 'rgba(255,255,255,0.18)',
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
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'float-fast': 'float 4s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'grain': 'grain 1s steps(2) infinite',
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
          '0%, 100%': { boxShadow: '0 0 20px rgba(255,107,107,0.3)' },
          '50%': { boxShadow: '0 0 60px rgba(255,107,107,0.7)' },
        },
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(-5%, -10%)' },
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
        'glow-coral':  '0 0 40px rgba(255, 107, 107, 0.45)',
        'glow-sun':    '0 0 40px rgba(255, 217, 61, 0.45)',
        'glow-teal':   '0 0 40px rgba(78, 205, 196, 0.45)',
        'glow-violet': '0 0 40px rgba(167, 139, 250, 0.4)',
        'glow-lavender': '0 0 40px rgba(167, 139, 250, 0.4)',
        'glow-peach':  '0 0 40px rgba(255, 217, 61, 0.4)',
        'glow-dusty':  '0 0 40px rgba(255, 107, 107, 0.45)',
        'card':        '0 8px 32px rgba(0,0,0,0.4)',
        'card-hover':  '0 20px 60px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
}
