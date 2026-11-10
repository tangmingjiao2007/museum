/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'museum-primary': '#2C3639',
        'museum-secondary': '#3F4E4F',
        'museum-accent': '#A27B5C',
        'museum-light': '#DCD7C9',
        'museum-gold': '#D4AF37',
        'museum-copper': '#B87333',
        'museum-terra': '#CD5C5C',
        'museum-jade': '#00A86B',
        'museum-dark': '#333333',
        'museum-light-primary': '#F5F7FA',
        'museum-light-secondary': '#EEF2F7',
        'museum-light-accent': '#5E81AC',
        'museum-light-gold': '#D4AF37',
        'museum-light-copper': '#C87941',
        'museum-light-terra': '#E78A8A',
        'museum-light-jade': '#5BBEA0',
        'ink': '#0E1418',
        'ink-2': '#151C22',
        'ink-3': '#1A2228',
        'ink-4': '#232D35',
        'hairline': '#2A343C',
        'antique': '#C9A227',
        'bronze': '#B87333',
        'cream': '#E8E3DA',
        'muted': '#9AA5AC',
        'ember': '#8C2F2F',
      },
      fontFamily: {
        serif: ['"Songti SC"', '"SimSun"', '"Noto Serif SC"', 'serif'],
      },
      backdropBlur: {
        'xs': '2px',
      }
    }
  },
  plugins: [],
}
