/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      backgroundImage: {
        'img': "url('./assets/images/image.png')"
      },
      colors: {
        'primary': '#00c52a',
        'secondary': '#444444',
        'title': '#222222',
        'brand-dark': '#00A323',
        'dark-white': '#DDDDDD',
        'ash': '#999999'
      },
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"]
      }
    },
  },
  plugins: [
      require('@tailwindcss/forms')
  ],
}
