const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPugPlugin = require('html-webpack-pug-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const styleLoader = {
  use: [{
    loader: 'css-loader'
  }, {
    loader: 'sass-loader',
    options: {
      includePaths: [
        path.resolve(__dirname, './src/web/assets/styles')
      ]
    }
  }]
};

const config = {
  entry: './src/web/assets/scripts/application.js',

  output: {
    publicPath: '/assets',
    path: path.resolve(__dirname, './src/web/public/assets'),
    filename: '[name].js'
  },

  watch: false,

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
          name: '[name].[ext]'
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
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/web/views/layouts/application.pug'),
      filename: path.resolve(__dirname, './src/web/views/layouts/application.pug'),
    }),
    new HtmlWebpackPugPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].min.css",
    }),
    new CleanWebpackPlugin(['./src/web/public/assets'])
  ]
};



module.exports = config;
