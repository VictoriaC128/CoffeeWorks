/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        coffee: {
          50: '#fdf8f4',
          100: '#f9eee3',
          200: '#f2dcbf',
          300: '#e7c293',
          400: '#dba365',
          500: '#c8803b',
          600: '#af642d',
          700: '#8d4b26',
          800: '#723e24',
          900: '#5c3321',
          950: '#341a10',
        },
        crema: {
          DEFAULT: '#E9C46A',
          light: '#F4A261',
        },
        roast: {
          light: '#C68B59',
          medium: '#8D5B4C',
          dark: '#3D2314',
          nanyang: '#1E120A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace']
      }
    },
  },
  plugins: [],
}
