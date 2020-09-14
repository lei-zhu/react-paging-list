const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackBar = require('webpackbar');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: {
    main: path.join(__dirname, './../', 'src/pages/index.tsx'),
  },
  output: {
    path: path.join(__dirname, './../', 'dist'),
    filename: '[name].[contentHash].bundle.js',
  },
  module: {
    rules: [
      {
        text: /\.ts(x?)$/,
        use: [
          {
            loader: 'awesome-typescript-loader',
            options: {},
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, './../', 'src/pages/index.html'),
    }),
    new WebpackBar({
      name: 'react-paging-list',
      color: '#61dafb',
    }),
    new FriendlyErrorsWebpackPlugin(),
    new CaseSensitivePathsPlugin(),
    new CircularDependencyPlugin({
      exclude: /node_modules/,
      include: /src/,
      failOnError: true,
      allowAsyncCycles: false,
      cwd: process.cwd(),
    }),
    new CleanWebpackPlugin(),
  ],
};
