process.env.NODE_ENV = 'development';

const chalk = require('chalk');
const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const config = require('../webpack.config');

const protocol = 'http';
const host = 'localhost';
const port = process.env.PORT || 3000;

function log(...messages) {
  console.log(...messages); // eslint-disable-line no-console
}

const compiler = webpack(config);
compiler.plugin('done', (stats) => {
  // We have switched off the default Webpack output in WebpackDevServer
  // options so we are going to "massage" the warnings and errors and present
  // them in a readable focused way.
  const messages = stats.toJson({}, true);
  if (!messages.errors.length && !messages.warnings.length) {
    log(chalk.green('Compiled successfully!'));
    log();
    log('The app is running at:');
    log();
    log(`  ${chalk.cyan(`${protocol}://${host}:${port}/`)}`);
  }

  // If errors exist, only show errors.
  if (messages.errors.length) {
    log(chalk.red('Failed to compile.'));
    log();
    messages.errors.forEach((message) => {
      log(message);
      log();
    });
    return;
  }

  // Show warnings if no errors were found.
  if (messages.warnings.length) {
    log(chalk.yellow('Compiled with warnings.'));
    log();
    messages.warnings.forEach((message) => {
      log(message);
      log();
    });
  }
});

const devServer = new WebpackDevServer(compiler, {
  // clientLogLevel: 'none',
  contentBase: path.resolve('app'),
  hot: true,
  publicPath: config.output.publicPath,
  quiet: true,
  watchOptions: {
    ignored: /node_modules/,
  },
  https: protocol === 'https',
  historyApiFallback: true,
  host,
});

devServer.listen(port, (err/* , result*/) => {
  if (err) {
    return log(err);
  }

  log(chalk.cyan('Starting the development server...'));
  return log();
});
