module.exports = {
  extends: require.resolve('@ginterdev/toolkit/eslint'),
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['**/.*rc.js'] },
    ],
  },
};
