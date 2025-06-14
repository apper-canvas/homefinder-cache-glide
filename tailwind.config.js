/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2C5282',
        secondary: '#ED8936',
        accent: '#38B2AC',
        surface: '#FFFFFF',
        background: '#F7FAFC',
        success: '#48BB78',
        warning: '#F6AD55',
        error: '#FC8181',
        info: '#4299E1',
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Playfair Display', 'serif'],
        display: ['Playfair Display', 'serif']
      },
      boxShadow: {
        'card': '0 4px 8px rgba(0, 0, 0, 0.1)',
        'lift': '0 8px 24px rgba(0, 0, 0, 0.15)',
      },
      scale: {
        '102': '1.02',
      }
    },
  },
  plugins: [],
}