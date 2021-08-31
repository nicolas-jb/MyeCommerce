import express, { json, urlencoded } from "express";
import emoji from "node-emoji";
import { routerProductos } from "../backend/router/routes_products.js";
import { routerCarrito } from "../backend/router/routes_carts.js";

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));

app.use("/api/productos", routerProductos);
app.use("/api/carrito", routerCarrito);

const PORT = 8080;

app.use((req, res) => {
  res.status(404).json({
    error: -2,
    descripción: `ruta ${req.url} método ${req.method} no implementado`,
  });
});

app.listen(PORT, () => {
  console.log(emoji.get("computer"), "Server on " + PORT);
});


