const { fontFamily } = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  safelist: [
    {
      pattern: /bg-(.*)-(100|200|500)/,
      variants: ['hover', 'focus'],
    },
    {
      pattern: /text-(.*)-(600)/,
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
        '2xl': '12rem',
      },
    },
    extend: {
      colors: {
        'blue-500': '#0967D2',
        'blue-600': '#0552B5',
        'blue-700': '#03449E',
        'gray-100': '#F5F7FA',
        'gray-200': '#E4E7EB',
        'gray-300': '#CBD2D9',
        'gray-400': '#9AA581',
        'gray-500': '#7B8794',
        'gray-600': '#616E7C',
        'gray-700': '#3E4C59',
        'gray-800': '#323F48',
        'gray-900': '#1F2933',
      },
      fontFamily: {
        sans: ['var(--font-montserrat)', ...fontFamily.sans]
      }
    },
  },
  plugins: [],
};
