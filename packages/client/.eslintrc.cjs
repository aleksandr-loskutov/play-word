module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 11,
    project: './tsconfig.eslint.json',
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/ban-ts-comment': 1,
    "react/react-in-jsx-scope": "off",
    'no-param-reassign': ['error', { ignorePropertyModificationsFor: [ 'state', ] }],
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        "": "never",
        "js": "never",
        "jsx": "never",
        "ts": "never",
        "tsx": "never"
      }
   ],
   "class-methods-use-this": "off",
    "import/no-extraneous-dependencies": [
      "error",
      {
        "devDependencies": [
          "test.{ts,tsx}",
          "test-*.{ts,tsx}",
          "**/*{.,_}{test,spec}.{ts,tsx}",
          "**/jest.config.js",
          "**/setup-tests.ts",
          "**/tests/utils/*.{ts,tsx}"
        ],
        "optionalDependencies": false
      }
    ]
  }
}
