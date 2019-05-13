const path = require('path');

module.exports = {
  extends: require.resolve('./.eslintrc.base.js'),
  settings: {
    'import/resolver': {
      'babel-module': {
        alias: {
          assets: path.resolve(__dirname, 'src/assets'),
          components: path.resolve(__dirname, 'src/components'),
          constants: path.resolve(__dirname, 'src/constants'),
          containers: path.resolve(__dirname, 'src/containers'),
          helpers: path.resolve(__dirname, 'src/helpers'),
          locales: path.resolve(__dirname, 'src/locales'),
          mocks: path.resolve(__dirname, 'src/mocks'),
          pages: path.resolve(__dirname, 'src/pages'),
          shared: path.resolve(__dirname, 'src/shared'),
          static: path.resolve(__dirname, 'src/static'),
          store: path.resolve(__dirname, 'src/store'),
          themes: path.resolve(__dirname, 'src/themes'),
          utils: path.resolve(__dirname, 'src/utils'),
        },
      },
      node: {
        extensions: ['.js'],
      },
    },
  },
  rules: {
    'react/prop-types': [2, { ignore: ['className', 'children', 'forwardRef', 't'] }],
  },
};
