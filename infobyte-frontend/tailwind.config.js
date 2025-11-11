const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      ...colors,
      
      // 1. Text & Borders: Swapped to 'neutral' or 'stone' for a slight contrast
      // This gives the text a softer, less harsh look against the dark background.
      gray: colors.neutral,

      // 2. Backgrounds: 'Zinc' provides that "Grey Black" / "Darker Black" look.
      // zinc-950 is a very deep, rich black-grey.
      navy: {
        900: '#09090b', // zinc-950 (Main Background - Darker Black)
        800: '#18181b', // zinc-900 (Card/Sidebar Background - Grey Black)
        700: '#27272a', // zinc-800 (Hover states)
        600: '#3f3f46', // zinc-700 (Borders)
      },

      // 3. Accents: Kept your vibrant colors but you can swap blue to 'white' or 'zinc-200' 
      // for a monochrome "Apple/Vercel" look if preferred. 
      // I'll keep the blue for now as it pops well on black.
      accent: {
        blue: '#3b82f6',   // Standard bright blue
        purple: '#a855f7',
        pink: '#ec4899',
      },
    },
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}