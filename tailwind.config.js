/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'gold': {
          100: '#fff1e6',
          200: '#ffe4bc', 
          300: '#ffd700',
        },
        'party': {
          100: '#ffd700',
          200: '#ff69b4',
          300: '#00ffff',
        },
        'blue': {
          700: '#1a365d',
          800: '#1e4d8c',
          900: '#1e3a8a',
          950: '#172554',
        },
        'purple': {
          900: '#581c87',
        }
      },
      fontFamily: {
        'medieval': ['MedievalFont', 'Times New Roman', 'serif'],
      },
      animation: {
        'sparkle': 'sparkle 2s infinite',
        'fadeIn': 'fadeIn 0.5s ease-out forwards',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        sparkle: {
          '0%, 100%': { opacity: 0.3 },
          '50%': { opacity: 1 },
        },
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
 }