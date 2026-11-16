/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 红色革命主题色板
        'museum-primary': '#8B1A1A',
        'museum-secondary': '#A52A2A',
        'museum-accent': '#C9A227',
        'museum-light': '#F5EFE3',
        'museum-gold': '#C9A227',
        'museum-copper': '#B87333',
        'museum-terra': '#8B1A1A',
        'museum-jade': '#5B7553',
        'museum-dark': '#3A2A1A',
        'museum-light-primary': '#F5EFE3',
        'museum-light-secondary': '#EDE3D2',
        'museum-light-accent': '#8B1A1A',
        'museum-light-gold': '#C9A227',
        'museum-light-copper': '#B87333',
        'museum-light-terra': '#A52A2A',
        'museum-light-jade': '#6B8E5A',
        // 墨黑系保留（用于极少处需要深色的区域）
        'ink': '#3A2A1A',
        'ink-2': '#4A3826',
        'ink-3': '#5A4530',
        'ink-4': '#6B5740',
        'hairline': '#D4C5A9',
        'antique': '#C9A227',
        'bronze': '#B87333',
        // 宣纸米白系（新主背景）
        'cream': '#F5EFE3',
        'cream-2': '#FAF6EC',
        'cream-3': '#EDE3D2',
        'cream-4': '#E2D5BE',
        'muted': '#6B5B4E',
        'ember': '#8B1A1A',
        // 朱红革命红
        'red-revolution': '#8B1A1A',
        'red-flag': '#A52A2A',
        'red-deep': '#6B0F0F',
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
