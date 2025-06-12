/* eslint-env node */
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  transform: {
    '\\.tsx?$': 'ts-jest',
    '\\.jsx?$': 'babel-jest',
    '\\.html$': 'jest-html-loader',
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
      'jest-transform-stub',
  },
  moduleNameMapper: {
    '^@common/(.*)': '<rootDir>/../common/$1',
    '^@server/(.*)': '<rootDir>/../server/$1',
    '^uuid$': require.resolve('uuid'),
    '^lodash-es$': 'lodash',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.ts'],
  testEnvironment: 'node',

  collectCoverage: process.env.COVERAGE === '1',
  collectCoverageFrom: ['<rootDir>/**/*.{js,jsx,ts,tsx}'],
  coveragePathIgnorePatterns: [],
  // Uncomment below to set a global coverage
  // coverageThreshold: {
  //   global: {
  //     branches: 80,
  //     functions: 80,
  //     lines: 80,
  //     statements: -10,
  //   },
  // },
}
