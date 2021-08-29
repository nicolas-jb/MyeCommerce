import { Router } from "express";

const routerProductos = new Router();
const routerCarrito = new Router();

routerProductos.get("/", (req, res) => {
  res.send("ok Prod");
});

routerCarrito.get("/", (req, res) => {
  res.send("ok Carrito");
});



export { routerCarrito };
export { routerProductos };
