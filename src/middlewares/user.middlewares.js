export function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send("Error de Log");
  }
}
