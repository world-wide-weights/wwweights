// Parsing error: Cannot find module 'next/babel' is not fixable yet without breaking es-lint: https://github.com/world-wide-weights/wwweights/issues/190
const { fontFamily } = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "src/pages/**/*.{ts,tsx}",
        "src/components/**/*.{ts,tsx}"
    ],
    safelist: [
        {
            pattern: /bg-(.*)-(100|200|500)/,
            variants: ['hover', 'focus'],
        },
        {
            pattern: /text-(.*)-(500|600|700|800)/,
            variants: ['hover', 'focus'],
        }
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
                blue: {
                    '50': '#e6effa',
                    '100': '#cae8fc',
                    '200': '#BAE3FF',
                    '300': '#60b4fa',
                    '400': '#0F7AF5',
                    '500': '#0967D2',
                    '600': '#0552B5',
                    '700': '#03449E',
                    '800': '#043266',
                    '900': '#021831',
                },
                gray: {
                    '100': '#F5F7FA',
                    '200': '#DDE5EF',
                    '300': '#CBD2D9',
                    '400': '#b5bec7',
                    '500': '#7B8794',
                    '600': '#616E7C',
                    '700': '#3E4C59',
                    '800': '#323F48',
                    '900': '#1F2933',
                }
            }, backgroundImage: {
                'background-half-page': `url('../../public/background_half_page.svg')`,
                'background-header-index': `url('../../public/background_header_index.svg')`,
            }
        },
        fontFamily: {
            sans: ['var(--font-metropolis)', ...fontFamily.sans],
        },
    },
    plugins: [],
}
