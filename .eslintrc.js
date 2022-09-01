module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
    '@vue/typescript/recommended',
  ],
  globals: {
    uni: true,
    getApp: true
  },
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    "comma-dangle": 0,
    // "no-console": 0,
    "max-len": [
      "error",
      {
        "code": 20000
      }
    ],
    "arrow-parens": 0,
    "no-underscore-dangle": 0,
    "global-require": 0,
    '@typescript-eslint/no-var-requires': 0,
    'class-methods-use-this': 'off',
    "prefer-destructuring": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "no-tabs":"off",
    "import/no-cycle": 1
  },
};
