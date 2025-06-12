/* eslint-env node */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
  },
  ignorePatterns: [
    'src/frontend',
    'dist',
    '.eslintrc.js',
    'docker',
    'node_modules',
  ],
  env: {
    es6: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
  ],
  plugins: ['prettier', 'import', 'unused-imports', '@typescript-eslint'],
  rules: {
    // Warns
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],

    // Error
    'prettier/prettier': ['error'],
    'unused-imports/no-unused-imports': 'error',
    'no-shadow': 'off', // replaced by ts-eslint rule below
    '@typescript-eslint/no-shadow': 'error',

    // off
    'import/prefer-default-export': 'off',
    'lines-between-class-members': 'off',
    'no-param-reassign': 'off',
    'prefer-destructuring': 'off',
    'no-unused-vars': 'off',
    'no-underscore-dangle': 'off',
    'import/no-extraneous-dependencies': 'off',
    'no-nested-ternary': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-unused-vars': 'off',

    radix: 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
  },
  settings: {
    'import/resolver': ['typescript', 'node'],
    react: {
      version: 'detect',
    },
  },
}
