import log4js from "../utils/logger.utils.js";

const loggerConsole = log4js.getLogger();
const loggerError = log4js.getLogger("errorFile");

export function errorAuth(ruta, method) {
  const mjeLog = `Ruta ${ruta} - Método ${method} no autorizado`;
  loggerConsole.error(mjeLog);
  loggerError.error(mjeLog);
  return {
    error: -1,
    descripcion: mjeLog,
  };
}

export function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    if (req.user.rol === "admin") {
      next();
    } else {
      res.status(403).send(errorAuth(req.originalUrl, req.method));
    }
  } else {
    const mjeLog = "Usuario No Autenticado"
    loggerConsole.error(mjeLog);
    loggerError.error(mjeLog);
    res.status(403).send(mjeLog);
  }
}
