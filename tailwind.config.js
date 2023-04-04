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
  ],
  plugins: [forms, lineClamp, typography],
  theme: {
    extend: {
      fontFamily: {},
      colors: {
        teal: {
          0: '#00857F',
        },
      },
    },
  },
};
