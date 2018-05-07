require('ts-node/register');

const app = require('./web/index.ts').default;

if (process.env.NODE_ENV === 'development') {
  const webpack = require('webpack');
  const middleware = require('webpack-dev-middleware');
  const options = require('../webpack.config');

  const compiler = webpack({
    ...options,
    mode: 'development',
  });

  app.use(middleware(compiler, {
    publicPath: options.output.publicPath,
    writeToDisk: (filePath) => {
      return /.*\.(css|js|jpg|png|svg|eot|ttf|woff)$/.test(filePath);
    },
    watch: false,
  }));
}


module.exports = app;
