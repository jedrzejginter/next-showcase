const eslintConfig = require('@ginterdev/toolkit/eslint');

module.exports = {
  ...eslintConfig,
  extends: eslintConfig.extends.filter(
    (ext) => !/prettier\/(react|@typescript-eslint)/.test(ext),
  ),
  rules: {
    ...eslintConfig.rules,
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['**/.*rc.js'] },
    ],
  },
};
