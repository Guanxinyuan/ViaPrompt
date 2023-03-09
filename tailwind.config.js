/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    './pages/**/*.{js,ts,jsx,tsx}',
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      aspectRatio: ['responsive'], // enable the aspectRatio utility
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ]
}