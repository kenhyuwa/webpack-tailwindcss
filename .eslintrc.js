module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 8,
    sourceType: 'module',
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  rules: {
    'prettier/prettier': 0,
    'no-unused-vars': 1,
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single', { allowTemplateLiterals: true }],
    'prefer-const': 'error',
    eqeqeq: ['error', 'always'],
    curly: ['error'],
  },
};
