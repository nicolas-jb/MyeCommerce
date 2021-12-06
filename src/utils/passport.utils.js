import bcrypt from "bcrypt";
import { Strategy } from "passport-local";
import passport from "passport";
import { UserModel } from "../models/model.js";
import { User } from "../services/user.js";
import { contenedorUsuario } from "../server.js";

function isValidPassword(user, password) {
  return bcrypt.compareSync(password, user.password);
}

passport.use(
  "login",
  new Strategy(async (username, password, done) => {
    const user = await contenedorUsuario.getByEmail(username);
    if (!user) {
      console.log("Usuario no encontrado!");
      return done(null, false);
    }
    if (!isValidPassword(user, password)) {
      console.log("Invalid password");
      return done(null, false);
    }
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
          console.log("El usuario existe!");
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

        console.log("Usuario creado");
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
  UserModel.findById(id, done)
});

export default passport;
