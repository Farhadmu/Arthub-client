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
        brand: {
          50: '#fdf8f6',
          100: '#f9ede8',
          200: '#f3dad0',
          300: '#e8b8a7',
          400: '#db8f76',
          500: '#e07a5f',
          600: '#c96144',
          700: '#a84c33',
          800: '#873d2b',
          900: '#6d3426',
        },
        gold: {
          300: '#f0d984',
          400: '#e5c358',
          500: '#d4af37',
          600: '#b89428',
        },
        canvas: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#4b5568',
          600: '#323b4d',
          700: '#232936',
          750: '#1a1f2c',
          800: '#171b24',
          850: '#13161e',
          900: '#0f1117',
          950: '#08090c',
        },
        ivory: {
          50: '#fcfbfa',
          100: '#f7f5f0',
          200: '#eee9e0',
          300: '#ded7c8',
          400: '#c7bca7',
        },
        // Backward-compatibility keys
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
          800: '#171b24',
          900: '#0f1117',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(0, 0, 0, 0.4), 0 0 25px 0 rgba(224, 122, 95, 0.08)',
        'luxury-sm': '0 10px 25px -10px rgba(0, 0, 0, 0.3)',
        'glow': '0 0 20px rgba(224, 122, 95, 0.35)',
        'glow-gold': '0 0 20px rgba(212, 175, 55, 0.35)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
      },
    },
  },
  plugins: [],
}