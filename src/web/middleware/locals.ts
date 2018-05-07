export default function localsMiddleware(req, res, next) {
  res.locals.csrfToken = req.csrfToken();
  res.locals.user = req.user;
  return next();
}
