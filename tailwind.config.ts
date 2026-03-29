import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          50: '#fff0f6',
          100: '#ffe3ef',
          200: '#ffc2d8',
          300: '#ff91ba',
          400: '#ff5a95',
          500: '#ff2d76',
          600: '#f00058',
          700: '#cc004b',
          800: '#a80040',
          900: '#8c0039',
        },
      },
    },
  },
  plugins: [],
}
export default config
