/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: [
    './.eslintrc-auto-import.json',
    'plugin:vue/vue3-essential',
    'airbnb',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting',
  ],
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    semi: ['warn', 'always'],
    'vue/multi-word-component-names': 'off',
    'prettier/prettier': ['error'],
  },
  settings: {
    'import/core-modules': ['vue-router/auto', 'vue-router/auto-routes'],
    'import/resolver': {
      alias: {
        map: [
          ['@', './src'], // 别名路径
        ],
      },
    },
  },
};
