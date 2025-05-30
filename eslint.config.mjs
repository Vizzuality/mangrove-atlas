import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  globalIgnores(['.next', 'node_modules', 'public', 'storybook-static']),
  {
    extends: compat.extends(
      'next/core-web-vitals',
      'plugin:prettier/recommended',
      'plugin:@tanstack/eslint-plugin-query/recommended',
      'next-typescript'
    ),
    rules: {
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

      'no-console': [
        1,
        {
          allow: ['info', 'error'],
        },
      ],

      'react/jsx-props-no-spreading': [
        'error',
        {
          html: 'ignore',
          custom: 'ignore',
          exceptions: [''],
        },
      ],

      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
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
          patterns: [
            {
              group: ['lodash', '!lodash-es'],
              message: 'Use lodash-es instead',
            },
          ],
        },
      ],
    },
  },
]);
