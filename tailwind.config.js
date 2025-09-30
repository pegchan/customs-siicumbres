/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        corporate: {
          dark: '#012D58',
          light: '#02ACF2',
          50: '#E6F4FC',   // muy claro
          100: '#CCE9F9',  // claro
          200: '#99D3F3',  // claro medio
          300: '#66BDED',  // medio
          400: '#33A7E7',  // medio oscuro
          500: '#02ACF2',  // color principal light
          600: '#0287C2',  // oscuro
          700: '#025A82',  // muy oscuro
          800: '#012D58',  // color principal dark
          900: '#011A33',  // extra oscuro
        },
        primary: {
          50: '#E6F4FC',
          500: '#02ACF2',
          600: '#0287C2',
          700: '#025A82',
          800: '#012D58',
        },
        secondary: {
          50: '#f8fafc',
          500: '#64748b',
          600: '#475569',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}