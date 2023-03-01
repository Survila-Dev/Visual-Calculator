/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        'fluid': 'repeat(auto-fit, minmax(12rem, 1fr))',
      }
    },
  },
  plugins: [],
}
