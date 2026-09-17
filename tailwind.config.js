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
        cricket: {
          pitch: '#1e3a24',
          grass: '#15803d',
          gold: '#f59e0b',
          crimson: '#dc2626',
          navy: '#0f172a',
          surface: '#182234',
          card: '#1e293b',
          accent: '#38bdf8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-gold': '0 0 20px -3px rgba(245, 158, 11, 0.4)',
        'glow-emerald': '0 0 20px -3px rgba(16, 185, 129, 0.4)',
        'glow-blue': '0 0 20px -3px rgba(56, 189, 248, 0.4)',
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-short': 'bounce 0.8s infinite',
      }
    },
  },
  plugins: [],
}
