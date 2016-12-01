process.env.NODE_ENV = 'development';

const chalk = require('chalk');
const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const config = require('../webpack.config');

// Server Configuration

const protocol = 'http';
const host = 'localhost';
const port = process.env.PORT || 3000;

// Helpers

const publicPath = `${protocol}://${host}:${port}`;

function log(...messages) {
  console.log(...messages); // eslint-disable-line no-console
}

// Enable HMR

config.entry = [
  `webpack-dev-server/client?${publicPath}/`,
  'webpack/hot/only-dev-server',
  // 'webpack/hot/dev-server',
  config.entry
];
config.plugins.push(new webpack.HotModuleReplacementPlugin());

const compiler = webpack(config);
const devServer = new WebpackDevServer(compiler, {
  // clientLogLevel: 'none',
  contentBase: path.resolve('app'),
  hot: true,
  publicPath,
  quiet: true,
  watchOptions: {
    ignored: /node_modules/
  },
  https: protocol === 'https',
  historyApiFallback: true,
  host
});

devServer.listen(port, (err/* , result*/) => {
  if (err) {
    return log(err);
  }

  log(chalk.cyan('Starting the development server...'));
  log();
  log('The app is running at:');
  log();
  log(`  ${chalk.cyan(`${publicPath}/`)}`);
  return log();
});
