import * as webpack from 'webpack';
import * as devMiddleware from 'webpack-dev-middleware';
import * as options from '../../../webpack.config';

const compiler = webpack({
  ...options,
  mode: 'development',
});

export default devMiddleware(compiler, {
  publicPath: options.output.publicPath,
  serverSideRender: true,
  stats: 'minimal',
  watch: false,
  writeToDisk: true,
});
