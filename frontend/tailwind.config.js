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
    extend: {},
  },
  plugins: [],
};
