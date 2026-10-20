/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0284c7',
          600: '#0369a1',
          700: '#075985',
          800: '#0c4a6e',
          900: '#082f49',
          950: '#031726'
        },
        gwp: {
          verylow: '#ef4444',
          low: '#f97316',
          moderate: '#eab308',
          high: '#84cc16',
          veryhigh: '#10b981'
        }
      }
    },
  },
  plugins: [],
}
