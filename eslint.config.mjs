/** @type {import("eslint").Linter.FlatConfig[]} */
import js from '@eslint/js'
import importPlugin from 'eslint-plugin-import'
import prettierPlugin from 'eslint-plugin-prettier'
import unusedImportsPlugin from 'eslint-plugin-unused-imports'
import tseslint from 'typescript-eslint'

const tsAllRulesOff = Object.fromEntries(
  Object.keys(tseslint.plugin.rules).map(name => [
    `@typescript-eslint/${name}`,
    'off',
  ]),
)

export default tseslint.config(
  {
    ignores: ['src/frontend', 'dist', 'docker', 'node_modules'],
  },
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        project: [
          './tsconfig.json',
          './src/server/tsconfig.json',
          './src/cli/tsconfig.json',
          './src/common/tsconfig.json',
          './pulumi/tsconfig.json',
        ],
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      prettier: prettierPlugin,
      import: importPlugin,
      'unused-imports': unusedImportsPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: true,
        node: true,
      },
      react: {
        version: 'detect',
      },
    },
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
  },
  {
    files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
    rules: tsAllRulesOff,
  },
)
