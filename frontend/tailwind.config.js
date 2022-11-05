/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}'
  ],
  safelist: [{
      pattern: /(bg)-*/,
    }
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}