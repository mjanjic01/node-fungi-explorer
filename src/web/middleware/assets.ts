export default async function assetsMiddleware(req, res, next) {
  const { main } = process.env.NODE_ENV === 'development' ?
    res.locals.webpackStats.toJson().assetsByChunkName :
    await import('../assets/bundle.stats.json'); // TODO: move to app.locals instead

  res.locals._webpackBundle = main.reduce((acc, asset) => {
    if (asset.endsWith('.js')) {
      acc.javascripts.push(`/assets/${asset}`);
    } else if (asset.endsWith('.css')) {
      acc.stylesheets.push(`/assets/${asset}`);
    }

    return acc;
  }, {
    javascripts: [],
    stylesheets: [],
  });

  next();
}
