/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0a0e27',
          800: '#141937',
          700: '#1a2142',
          600: '#252d4f',
        },
        accent: {
          blue: '#4f6bff',
          purple: '#8b5cf6',
          pink: '#ec4899',
        }
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}