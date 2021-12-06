import express, { json, query, urlencoded } from "express";
import emoji from "node-emoji";
import session from 'express-session'
import { routerProductos } from "./routers/product.route.js";
import { routerUsuario } from "./routers/user.route.js";
import { ContenedorProducto, ContenedorUsuario } from "./services/container.js";
import { ProductoModel, UserModel } from "./models/model.js";
import passport from './utils/passport.utils.js'

const app = express();


const contenedorProducto = new ContenedorProducto(ProductoModel);
const contenedorUsuario = new ContenedorUsuario(UserModel);

app.use(json());
app.use(urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SECRET,
    cookie: {
      maxAge: Number(process.env.EXPIRE),
    },
    rolling: true,
    resave: true,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/productos", routerProductos);
app.use("/api/user", routerUsuario);


export const PORT = process.env.PORT || 8080;

app.use((req, res) => {
  res.status(404).json({
    error: -2,
    descripción: `ruta ${req.url} método ${req.method} no implementado`,
  });
});

app.listen(PORT, () => {
  console.log(emoji.get("computer"), "Server on " + PORT);
});


export { contenedorProducto };
export { contenedorUsuario };
