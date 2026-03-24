/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: '#0F3460',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
