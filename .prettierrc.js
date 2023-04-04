const tailwindPlugin = require('prettier-plugin-tailwindcss');

const config = {
  semi: true,
  tabWidth: 2,
  printWidth: 100,
  singleQuote: true,
  plugins: [tailwindPlugin],
};

module.exports = config;
