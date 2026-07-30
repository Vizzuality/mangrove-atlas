const path = require('path');

const relative = (filenames) =>
  filenames.map((f) => `"${path.relative(process.cwd(), f)}"`).join(' ');

const buildEslintCommand = (filenames) => `eslint --fix ${relative(filenames)}`;

// Accessibility rules live in .oxlintrc.json, separate from ESLint, so a11y regressions are
// caught at commit time rather than in review.
const buildA11yCommand = (filenames) => `oxlint ${relative(filenames)}`;

module.exports = {
  '*.{js,jsx,ts,tsx}': [buildEslintCommand, buildA11yCommand],
};
