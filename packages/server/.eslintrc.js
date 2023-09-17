module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: [
    'airbnb/base',
    'airbnb-typescript/base',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 11,
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/ban-ts-comment': 1,
    '@typescript-eslint/no-unused-vars': 0, //TODO decorators is not recognized as used vars
    'max-classes-per-file': 0, //DTO classes need to be in one file
    'import/no-extraneous-dependencies': 0, //we are importing types from express but its not in deps so linter is mad
  },
};
