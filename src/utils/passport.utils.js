import bcrypt from "bcrypt";
import { Strategy } from "passport-local";
import passport from "passport";
import { UserModel } from "../models/model.js";
import { User } from "../services/user.js";
import { contenedorUsuario } from "../server.js";
import log4js from "../utils/logger.utils.js";
import dotenv from "dotenv";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { envioMail, armarCuerpoMailRegistro } from "../utils/mailer.utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const loggerConsole = log4js.getLogger();
const loggerError = log4js.getLogger("errorFile");

function isValidPassword(user, password) {
  return bcrypt.compareSync(password, user.password);
}

passport.use(
  "login",
  new Strategy(async (username, password, done) => {
    const user = await contenedorUsuario.getByEmail(username);
    if (!user) {
      loggerConsole.error("Error Login");
      loggerError.error("Error Login - Usuario no encontrado");
      return done(null, false);
    }
    if (!isValidPassword(user, password)) {
      loggerConsole.error("Error Login");
      loggerError.error("Error Login - Contraseña Inválida");
      return done(null, false);
    }
    loggerConsole.info(`Usuario: ${user.username} logueado`);
    return done(null, user);
  })
);

function createHash(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

passport.use(
  "signup",
  new Strategy(
    {
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      try {
        let user = await contenedorUsuario.getByEmail(username);
        if (user) {
          loggerConsole.error("Error SignUp");
          loggerError.error("Error SignUp - Usuario existente");
          return done(null, false);
        }

        const newUser = new User(
          username,
          createHash(password),
          req.body.nombre,
          req.body.direccion,
          req.body.edad,
          req.body.phone,
          req.body.avatar
        );

        await contenedorUsuario.save(newUser);
        user = await contenedorUsuario.getByEmail(username);

        envioMail(process.env.MAIL_ADMIN, "Nuevo Registro", armarCuerpoMailRegistro(user));

        loggerConsole.info(`Usuario: ${user.username} registrado`);
        return done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.serializeUser(async (user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  UserModel.findById(id, done);
});

export default passport;
