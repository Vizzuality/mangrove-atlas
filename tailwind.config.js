const forms = require('@tailwindcss/forms');
const lineClamp = require('@tailwindcss/line-clamp');
const typography = require('@tailwindcss/typography');

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
  ],
  plugins: [forms, lineClamp, typography],
  theme: {
    extend: {
      boxShadow: {
        light: '0px 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 4px 12px rgba(0, 0, 0, 0.08)',
      },
      fontFamily: {},
      colors: {
        black: '#000000',
        grey: {
          400: '#939393',
          800: '#808080',
        },
        brand: {
          400: '#00C5BD',
          800: '#00857F',
        },
      },
    },
  },
};
