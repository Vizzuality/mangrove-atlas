const path = require('path');

const relative = (filenames) =>
  filenames.map((f) => `"${path.relative(process.cwd(), f)}"`).join(' ');

const buildEslintCommand = (filenames) => `eslint --fix ${relative(filenames)}`;

// Accessibility rules live in .oxlintrc.json, separate from ESLint, so a11y regressions are
// caught at commit time rather than in review. Paths under .oxlintrc.json `ignorePatterns`
// (e.g. public/) are dropped first: oxlint exits non-zero when every file it is given is
// ignored ("No files found to lint"), which would block the commit.
const OXLINT_IGNORED = ['public/'];
const buildA11yCommand = (filenames) => {
  const lintable = filenames.filter(
    (f) => !OXLINT_IGNORED.some((dir) => path.relative(process.cwd(), f).startsWith(dir))
  );
  return lintable.length ? `oxlint ${relative(lintable)}` : 'true';
};

module.exports = {
  '*.{js,jsx,ts,tsx}': [buildEslintCommand, buildA11yCommand],
};
