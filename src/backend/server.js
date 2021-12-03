import express, { json, query, urlencoded } from "express";
import emoji from "node-emoji";
import { routerProductos } from "../backend/router/routes_products.js";
import { routerCarrito } from "../backend/router/routes_carts.js";
import {  ContenedorCarrito, ContenedorProducto } from "./services/MongoDB/contenedorMongo.js";
import { CarritoModel, ProductoModel } from "./models/model.js";

const app = express();

const contenedorCarrito = new ContenedorCarrito(CarritoModel);
const contenedorProducto = new ContenedorProducto(ProductoModel);

app.use(json());
app.use(urlencoded({ extended: true }));

app.use("/api/productos", routerProductos);
app.use("/api/carrito", routerCarrito);

export const PORT = 8080;

app.use((req, res) => {
  res.status(404).json({
    error: -2,
    descripción: `ruta ${req.url} método ${req.method} no implementado`,
  });
});

app.listen(PORT, () => {
  console.log(emoji.get("computer"), "Server on " + PORT);
});

export { contenedorCarrito };
export { contenedorProducto };
