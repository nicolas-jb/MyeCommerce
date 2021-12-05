export function postLogin(req, res) {
  const user = req.user;
  console.log(user);
  res.send("ACA REDIRECCIONAR AL CARRITO - LOGIN OK");
}

export function getFailLogin(req, res) {
  console.log("Error en el login");
  res.status(403).send("Error en el login");
}

export function postSignup(req, res) {
  const user = req.user;
  console.log(user);
  res.send("ACA REDIRECCIONAR AL CARRITO - REGISTRO OK");
}

export function getFailSignup(req, res) {
  console.log("Error en el Registro");
  res.status(403).send("Error en el Registro");
}
