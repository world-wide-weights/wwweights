/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  safelist: [
    {
      pattern: /bg-(.*)-500/,
    },
    {
      pattern: /text-(.*)-800/,
    },
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '10rem',
        '2xl': '18rem',
      },
    },
    extend: {},
  },
  plugins: [],
};
