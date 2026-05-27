/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
      colors: {
        aqua: {
          100: '#e0f2fe',
          300: '#7dd3fc',
          500: '#0ea5e9',
          700: '#0369a1',
          900: '#0c4a6e',
        },
        sidebar: '#1f2937',
        'lighter-grey': '#d1d5db',
        'saitgo-link': '#2563eb',
        'saitgo-error': '#dc2626'
      }
    },
  },
  plugins: [],
}
