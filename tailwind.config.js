const forms = require('@tailwindcss/forms');
const lineClamp = require('@tailwindcss/line-clamp');
const typography = require('@tailwindcss/typography');
const scrollBar = require('tailwind-scrollbar-hide');
const { fontFamily } = require('tailwindcss/defaultTheme');
const animate = require('tailwindcss-animate');

/**
 * @type {import('tailwindcss').Config}
 */

module.exports = {
  content: [
    './src/components/**/*.@(tsx|ts)',
    './src/containers/**/*.@(tsx|ts)',
    './src/layouts/**/*.@(tsx|ts)',
    './src/pages/**/*.@(tsx|ts)',
    './src/images/**/*.@(tsx|ts)',
    './src/svgs/**/*.@(tsx|ts)',
  ],
  plugins: [animate, forms, lineClamp, typography, scrollBar],
  theme: {
    extend: {
      backgroundImage: {
        rufiji: "url('/images/highlighted-places/rufiji.jpg')",
        saloum: "url('/images/highlighted-places/saloum.png')",
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
      },
      spacing: {
        7.5: '1.875rem',
        18: '4.5rem',
      },
      fontSize: {
        xxs: '0.625rem', // * 10px
        '2lg': '1.188rem', // * 19px
        '2.75xl': '1.688rem', // * 27px
      },
      colors: {
        black: '#000000',
        'black/85': 'rgba(0,0,0,85%)',
        grey: {
          50: '#F3F5F5',
          75: '#CDD0D0',
          100: '#D8D8D8',
          400: '#939393',
          800: '#808080',
        },
        brand: {
          100: '#F3F5F5',
          400: '#00C5BD',
          600: '#00AFA7',
          800: '#00857F',
        },
        blue: {
          400: '#7996F3',
        },
      },
      boxShadow: {
        widget: 'rgba(0, 0, 0, 0.08) 0px 4px 12px 4px',
        light: '0px 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 4px 12px rgba(0, 0, 0, 0.08)',
        soft: '0px 2px 5px 0px rgba(7, 127, 172, 0.43)',
        medium: '0px 4px 12px 0px rgba(168, 168, 168, 0.25)',
        '3xl': '0px 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 4px 12px rgba(0, 0, 0, 0.08)',
        control: '0px 4px 12px 0px rgba(0, 0, 0, 0.08)',
        border: '0px 40px 80px 0px rgba(0, 60, 57, 0.15), 0px 0px 0px 1px rgba(0, 0, 0, 0.10)',
      },
      width: {
        7.5: '1.875rem',
        10.5: '2.625rem',
        22: '5.5rem',
      },
      borderRadius: {
        '3xl': '1.25rem', // 20px
        '4xl': '1.5rem', // 24px
      },
      opacity: {
        15: '0.15',
      },
      letterSpacing: {
        2.5: '0.625rem',
      },
    },
  },
};
