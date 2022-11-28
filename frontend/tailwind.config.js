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
      pattern: /text-(.*)-(600|700|800)/,
      variants: ['hover', 'focus'],
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
    fontSize: {
      sm: '0.7rem',
      base: '0.9rem',
      lg: '1.0rem',
      xl: '1.2rem',
      "2xl": '1.463rem',
      "3xl": '1.853rem',
      "4xl": '2.341rem',
      "5xl": '2.952rem',
    },
    extend: {
      colors: {
        blue: {
          '50': '#98C6FB',
          '100': '#84BBFA',
          '200': '#5DA6F8',
          '300': '#3690F6',
          '400': '#0F7AF5',
          '500': '#0967D2',
          '600': '#0552B5',
          '700': '#03449E',
          '800': '#043266',
          '900': '#021831',
        },
        grey: {
          '100': '#F5F7FA',
          '200': '#E4E7EB',
          '300': '#CBD2D9',
          '400': '#9AA581',
          '500': '#7B8794',
          '600': '#616E7C',
          '700': '#3E4C59',
          '800': '#323F48',
          '900': '#1F2933',
        }
      }
    },
  },
  plugins: [],
};
