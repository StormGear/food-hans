/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      backgroundImage: {
        'custom-image': "url('/src/assets/images/back.jpg')",

      },
      transitionProperty: {
        'width-height': 'width, height',
      },
      colors: {
        'primary-color': '#CD5C5C',
        'secondary-color': '#FA8072',
      },
    },
  },
  plugins: [],
}

