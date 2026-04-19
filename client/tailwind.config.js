/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cosmic: {
          50: '#f0e8ff',
          100: '#d9c3ff',
          200: '#b899ff',
          300: '#9a6fff',
          400: '#7d45ff',
          500: '#6620ff',
          600: '#4b1a7a',
          700: '#380d5c',
          800: '#250640',
          900: '#1a0533',
          950: '#0d0220',
        },
        gold: {
          300: '#fde68a',
          400: '#fbbf24',
          500: '#f5c842',
          600: '#e8a200',
          700: '#b77d00',
        },
        aurora: {
          purple: '#9333ea',
          pink: '#ec4899',
          blue: '#3b82f6',
          indigo: '#6366f1',
        },
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'cosmic-gradient': 'linear-gradient(135deg, #1a0533 0%, #0d1b3e 50%, #1a0533 100%)',
        'gold-gradient': 'linear-gradient(135deg, #f5c842, #e8a200)',
        'aurora-gradient': 'linear-gradient(135deg, #4b1a7a, #1a0533, #0d1b3e)',
      },
      animation: {
        'twinkle': 'twinkle 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.6s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: 0.3, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.3)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(245,200,66,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(245,200,66,0.8)' },
        },
        slideUp: {
          from: { transform: 'translateY(30px)', opacity: 0 },
          to: { transform: 'translateY(0)', opacity: 1 },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'cosmic': '0 0 30px rgba(102, 32, 255, 0.3)',
        'gold': '0 0 20px rgba(245, 200, 66, 0.4)',
        'card': '0 8px 32px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
}
