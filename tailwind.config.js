/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#FBF8F4',
        cream: '#F3EDE4',
        ink: '#2B2622',
        stone: '#8A8178',
        gold: '#B08D57',
        goldlight: '#D6BE93',
        blush: '#C98A8A',
        rose: '#A66E6E',
        sage: '#8A9B83',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        script: ['"Great Vibes"', 'cursive'],
        sans: ['Jost', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 8px 30px rgba(43, 38, 34, 0.08)',
        card: '0 2px 12px rgba(43, 38, 34, 0.06)',
      },
    },
  },
  plugins: [],
}
