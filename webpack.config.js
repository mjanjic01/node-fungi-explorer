const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StatsWriterPlugin = require('webpack-stats-plugin').StatsWriterPlugin;

const INDENT = 2;
const PROD = process.env.NODE_ENV === 'production';

const config = {
  entry: './src/web/assets/scripts/application.js',

  output: {
    publicPath: '/assets',
    path: path.resolve(__dirname, './src/web/public/assets'),
    filename: '[name]-[contenthash].js'
  },

  resolve: {
    extensions: ['.js'],
    modules: [
      path.resolve(__dirname, './src/web/assets/styles'),
      path.resolve(__dirname, './src/web/assets/scripts'),
      path.resolve(__dirname, './src/web/assets/images'),
      'node_modules'
    ]
  },

  module: {
    rules: [{
      test: /\.(jpg|png|svg|eot|ttf|woff)$/,
      use: {
        loader: 'file-loader',
        options: {
          name: '[name]-[contenthash].[ext]'
        }
      }
    }, {
      test: /\.(js|jsx)$/,
      exclude: /(node_modules)/,
      loader: 'babel-loader'
    }, {
      test: /\.(css|scss)$/,
      use: [
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader'
        }, {
          loader: 'sass-loader',
          options: {
            includePaths: [
              path.resolve(__dirname, './src/web/assets/styles')
            ]
          }
        }
      ]
    }]
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name]-[contenthash].min.css",
    }),
    new CleanWebpackPlugin(['./src/web/public/assets'], {
      verbose: false,
    })
  ]
};

if (PROD) {
  config.plugins = [
    ...config.plugins,
    new StatsWriterPlugin({
      filename: '../../assets/bundle.stats.json',
      transform(data) {
        return JSON.stringify({
          main: data.assetsByChunkName.main
        }, null, INDENT);
      }
    })
  ]
}


module.exports = config;