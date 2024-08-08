/** @type {import('tailwindcss').Config} */


module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#94DFE1',
        secondary: '#4ACACF',
        container: '#F5FBF9'
      },
      rotate: {
        '30': '30deg',
      },
      utilities: {
        '.no-scrollbar': {
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          '-ms-overflow-style': 'none', 
          'scrollbar-width': 'none', 
        },
      },
    },
  },
  plugins: [],
}
