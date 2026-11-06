// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    // react-three-fiber usa props de three.js (position, intensity, args...) que no son DOM
    rules: { 'react/no-unknown-property': 'off' },
  },
]);
