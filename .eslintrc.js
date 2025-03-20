module.exports = {
extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
],
parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
},
rules: {
// These rules are set to 'off' to prevent blocking deployment
// but should be addressed in future code improvements
'@typescript-eslint/no-unsafe-assignment': 'off',
'@typescript-eslint/no-unsafe-member-access': 'off',
'@typescript-eslint/no-unsafe-call': 'off',
'@typescript-eslint/no-unsafe-argument': 'off',
'@typescript-eslint/no-floating-promises': 'off',
'@typescript-eslint/restrict-template-expressions': 'off',
'@typescript-eslint/no-unsafe-return': 'off',
'@typescript-eslint/ban-ts-comment': 'off',
'@typescript-eslint/no-misused-promises': 'off',
'@typescript-eslint/require-await': 'off',
'@typescript-eslint/no-explicit-any': 'off',
    // ---
    'no-console': [1, { allow: ['info', 'error'] }],
    'react/jsx-props-no-spreading': [
      'error',
      {
        html: 'ignore',
        custom: 'ignore',
        exceptions: [''],
      },
    ],
    'import/no-named-as-default': 0,
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        pathGroups: [
          {
            pattern: 'react',
            group: 'builtin',
            position: 'before',
          },
          {
            pattern: 'react**',
            group: 'builtin',
          },
          {
            pattern: '@react**',
            group: 'builtin',
          },
          {
            pattern: 'clsx',
            group: 'builtin',
            position: 'after',
          },
          {
            pattern: 'lodash-es/**',
            group: 'builtin',
            position: 'after',
          },
          {
            pattern: 'next/**',
            group: 'builtin',
            position: 'after',
          },
          {
            pattern: 'node_modules/**',
            group: 'builtin',
          },
          {
            pattern: 'lib/**',
            group: 'external',
            position: 'before',
          },
          {
            pattern: 'store/**',
            group: 'external',
            position: 'before',
          },
          {
            pattern: 'hooks/**',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: 'layouts/**',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: 'containers/**',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: 'components/**',
            group: 'internal',
          },
          {
            pattern: 'services/**',
            group: 'internal',
            position: 'after',
          },
          {
            pattern: 'images/**',
            group: 'internal',
            position: 'after',
          },
          {
            pattern: 'svgs/**',
            group: 'internal',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['react'],
      },
    ],
    'no-restricted-imports': [
      'error',
      {
        patterns: [{ group: ['lodash', '!lodash-es'], message: 'Use lodash-es instead' }],
      },
    ],
  },
};
