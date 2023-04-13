const forms = require('@tailwindcss/forms');
const lineClamp = require('@tailwindcss/line-clamp');
const typography = require('@tailwindcss/typography');
const { fontFamily } = require('tailwindcss/defaultTheme');

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
  plugins: [forms, lineClamp, typography],
  theme: {
    extend: {
      boxShadow: {
        light: '0px 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 4px 12px rgba(0, 0, 0, 0.08)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
      },
      fontSize: {
        xxs: 10,
        xl: 19,
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
