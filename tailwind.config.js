/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mitti: {
          50: '#fdf8f4',
          100: '#faeee2',
          200: '#f4dabf',
          300: '#ecc094',
          400: '#e29f65',
          500: '#da8241',
          600: '#cb6934',
          700: '#a94f2b',
          800: '#874029',
          900: '#6e3624',
          950: '#3c1a11',
        },
        krishi: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        }
      }
    },
  },
  plugins: [],
}
