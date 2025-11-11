const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    // We are replacing the default color palette, not just extending it.
    colors: {
      // First, import all default colors...
      ...colors,
      
      // ...then, override the 'gray' palette with 'slate'.
      // This is a powerful change: all existing 'text-gray-400', 'border-gray-700', etc.
      // will now use the 'slate' color palette, giving an instant modern feel.
      gray: colors.slate,

      // We replace the 'navy' palette with 'zinc'.
      // This gives a more neutral, less-blue background.
      navy: {
        900: colors.zinc[900], // #18181b
        800: colors.zinc[800], // #27272a
        700: colors.zinc[700], // #3f3f46
        600: colors.zinc[600], // #52525b
      },

      // Your original accent colors are good, so we'll keep them.
      accent: {
        blue: '#4f6bff',
        purple: '#8b5cf6',
        pink: '#ec4899',
      }
    },
    // We keep your font choices in 'extend'
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}