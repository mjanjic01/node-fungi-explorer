export default async function assetsMiddleware(req, res, next) {
  const { main } = process.env.NODE_ENV === 'development' ?
    res.locals.webpackStats.toJson().assetsByChunkName :
    await import('../assets/bundle.stats.json'); // TODO: move to app.locals instead

  res.locals._webpackBundle = {
    javascripts: main.find((asset) => asset.endsWith('.js')),
    stylesheets: main.find((asset) => asset.endsWith('.css')),
  };

  next();
}
