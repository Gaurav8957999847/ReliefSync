/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        navy: {
          50:  '#f0f4ff',
          100: '#e0eaff',
          500: '#3b5bdb',
          600: '#3451c7',
          700: '#2c44b0',
          800: '#1e2f7a',
          900: '#0f172a',
          950: '#080c17',
        },
      },
      boxShadow: {
        'card':       '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 6px rgba(0,0,0,0.06), 0 12px 40px rgba(0,0,0,0.10)',
        'modal':      '0 24px 64px rgba(0,0,0,0.20)',
        'sm-soft':    '0 1px 2px rgba(0,0,0,0.04)',
      },
    },
  },
  plugins: [],
}
