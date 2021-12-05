export function errorAuth(ruta, method) {
  return {
    error: -1,
    descripcion: `ruta ${ruta} método ${method} no autorizada`,
  };
}

export function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    if (req.user.rol === "admin") {
      next();
    }else{
      res.status(403).send(errorAuth(req.originalUrl, req.method));
    }
  } else {
    res.status(403).send("Error de Log");
  }
}

//import * as AuthMiddleware from '../middlewares/auth.middleware.js'
