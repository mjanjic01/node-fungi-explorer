export default function authenticationMiddleware(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  req.session._referringRoute = req.url;
  return res.redirect('/auth/login');
}
