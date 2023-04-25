const forms = require('@tailwindcss/forms');
const lineClamp = require('@tailwindcss/line-clamp');
const typography = require('@tailwindcss/typography');
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
  plugins: [animate, forms, lineClamp, typography],
  theme: {
    extend: {
      boxShadow: {
        light: '0px 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 4px 12px rgba(0, 0, 0, 0.08)',
        soft: '0px 2px 5px 0px rgba(7, 127, 172, 0.43)',
        medium: '0px 4px 12px 0px rgba(168, 168, 168, 0.25)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
      },
      spacing: {
        7.5: '1.875rem',
      },
      fontSize: {
        xxs: '0.625rem',
        '2lg': '1.188rem',
      },
      colors: {
        black: '#000000',
        grey: {
          100: '#D8D8D8',
          400: '#939393',
          800: '#808080',
        },
        brand: {
          400: '#00C5BD',
          600: '#00AFA7',
          800: '#00857F',
        },
      },
      width: {
        10.5: '2.625rem',
      },
      borderRadius: {
        '2.5xl': '1.3rem',
      },
      keyframes: {
        overlayShow: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        contentShow: {
          from: { opacity: 0, transform: 'translate(-50%, -48%) scale(0.96)' },
          to: { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
        },
      },
      animation: {
        overlayShow: 'overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        contentShow: 'contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
};
