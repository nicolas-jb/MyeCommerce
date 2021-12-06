import log4js from "../utils/logger.utils.js";

const loggerConsole = log4js.getLogger();
const loggerError = log4js.getLogger("errorFile");

export function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    const mjeLog = "Usuario No Autenticado"
    loggerConsole.error(mjeLog);
    loggerError.error(mjeLog);
    res.status(403).send(mjeLog);
  }
}
