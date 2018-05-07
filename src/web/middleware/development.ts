import * as webpack from 'webpack';
import * as devMiddleware from 'webpack-dev-middleware';
import * as options from '../../../webpack.config';

let middleware;
if (process.env.NODE_ENV === 'development') {
  const compiler = webpack({
    ...options,
    mode: 'development',
  });

  middleware = devMiddleware(compiler, {
    publicPath: options.output.publicPath,
    serverSideRender: true,
    stats: 'minimal',
    watch: false,
    writeToDisk: true,
  });
}

export default middleware;
