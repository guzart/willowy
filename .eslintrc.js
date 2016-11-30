
module.exports = {
  extends: 'airbnb-base',
  env: {
    es6: true,
    node: true,
  },
  rules: {
    semi: [2, 'never'],
  },
  settings: {
    'import/ignore': ['.html'],
  }
};
