import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import react from 'eslint-plugin-react';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettierRecommended,
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
      react: react,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      'no-unused-vars': 'off',

      '@next/next/no-img-element': 'off',

      // ❗ CẤM TEXT TRỰC TIẾP TRONG JSX
      'react/jsx-no-literals': [
        'error',
        {
          noStrings: true,
          allowedStrings: [
            '*',
            '-',
            ':',
            '⋮',
            '‹',
            '›',
            '…',
            '(',
            ')',
            '/',
            '%',
            '?',
            '|',
            '#',
            '@',
            '=',
            '+',
            '->',
            '<-',
            '.',
            ',',
            '[',
            ']',
            '{',
            '}',
            '/ 10',
            '--',
            '***',
            '&quot;',
            'LOGO',
          ],
          ignoreProps: true,
        },
      ],
    },
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'node_modules/**',
    'print-errors.js',
    'eslint-report.json',
  ]),
]);

export default eslintConfig;
