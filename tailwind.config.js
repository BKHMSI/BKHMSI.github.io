/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#e8f7f9',
          100: '#c5ecf1',
          200: '#8ed9e3',
          300: '#57c5d5',
          400: '#1aabb8',
          500: '#0b7f8f',
          600: '#0b5d73',
          700: '#094c5e',
          800: '#073b49',
          900: '#052a34',
        },
        accent: {
          50:  '#fff4ef',
          100: '#ffe3d4',
          200: '#ffc7a9',
          300: '#ffa87e',
          400: '#ef7d57',
          500: '#e0603a',
          600: '#c4462a',
          700: '#a33420',
          800: '#822a1c',
          900: '#6b2419',
        },
        ink: {
          50:  '#f6f8fb',
          100: '#eef3f8',
          200: '#d5dfeb',
          300: '#b0c0d4',
          400: '#8a9db6',
          500: '#5a6e88',
          600: '#455a74',
          700: '#34475f',
          800: '#1e3148',
          900: '#122033',
        },
        dark: {
          bg:      '#0d1117',
          surface: '#161b22',
          card:    '#1c2129',
          border:  '#30363d',
          text:    '#e6edf3',
          muted:   '#8b949e',
        },
      },
      fontFamily: {
        sans:  ['"Space Grotesk"', ...defaultTheme.fontFamily.sans],
        serif: ['"Source Serif 4"', 'Georgia', ...defaultTheme.fontFamily.serif],
      },
      borderRadius: {
        'xl':  '14px',
        '2xl': '22px',
      },
      boxShadow: {
        soft:  '0 10px 30px rgba(14, 34, 56, 0.08)',
        card:  '0 16px 40px rgba(14, 34, 56, 0.12)',
        glow:  '0 0 60px rgba(11, 127, 143, 0.15)',
      },
      animation: {
        'fade-in':    'fadeIn 0.5s ease-out forwards',
        'slide-up':   'slideUp 0.6s ease-out forwards',
        'slide-left': 'slideLeft 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          '0%':   { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
