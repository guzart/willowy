
module.exports = {
  extends: '../.eslintrc.js',
  env: {
    node: true,
  },
  rules: {
    'comma-dangle': [2, 'never'],
    semi: [2, 'always'],
    'import/no-extraneous-dependencies': [2, { devDependencies: true }],
  },
};
