
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

module.exports = {
  entry: './app/index.js',

  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'app.js',
    sourceMapFilename: 'app.js.map',
  },

  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, use: 'babel-loader' },
      { test: /\.svelte/, use: require.resolve('./svelte-loader') },
      // TODO: perform image-webpack optimizations
      { test: /\.(jpg|png|gif|ico)$/, use: 'file-loader' },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({ template: './app/index.html' }),
  ],

  devtool: 'cheap-module-source-map',
}
