/* eslint-disable no-param-reassign */
const path = require('path');
const webpack = require('webpack');
const DotEnv = require('dotenv-webpack');
const withSass = require('@zeit/next-sass');
const nextSourceMaps = require('@zeit/next-source-maps')();
const { compose } = require('ramda');
//const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');

module.exports = compose(
  nextSourceMaps,
  withSass
)({
  webpack: (config, { isServer, buildId }) => {
    config.plugins.push(
      // Read the .env file
      new DotEnv({
        path: path.join(__dirname, '.env'),
        systemvars: !process.env.IN_DOCKER,
      })
    );

    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.SENTRY_RELEASE': JSON.stringify(buildId),
      })
    );

    if (!isServer) {
      config.resolve.alias['@sentry/node'] = '@sentry/browser';
    }

    config.resolve.alias['styled-components'] = path.resolve('./node_modules/styled-components');

    return config;
  },
  // analyzeServer: ['server', 'both'].includes(process.env.BUNDLE_ANALYZE),
  // analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
  // bundleAnalyzerConfig: {
  //     server: {
  //         analyzerMode: 'static',
  //         reportFilename: '../../.analyze/server.html',
  //     },
  //     browser: {
  //         analyzerMode: 'static',
  //         reportFilename: '../../.analyze/client.html',
  //     },
  // },
});
