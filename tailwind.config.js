/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './context/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf8f5',
          100: '#f9ede6',
          200: '#f2d5c4',
          300: '#e8b59a',
          400: '#d98f6b',
          500: '#c97048',
          600: '#b85c38',
          700: '#9a4d2f',
          800: '#7c3e26',
          900: '#5e2f1d',
        },
        cream: {
          50: '#fdfbf9',
          100: '#f9f7f5',
          200: '#f3efe8',
          300: '#ebe5db',
          400: '#d9d0c2',
        },
        brown: {
          50: '#f5f0eb',
          100: '#e8ddd3',
          200: '#d4c4b3',
          300: '#b8a08a',
          400: '#9c7d64',
          500: '#7d6049',
          600: '#5e4535',
          700: '#3e2c22',
          800: '#2a1d16',
          900: '#1a110d',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}