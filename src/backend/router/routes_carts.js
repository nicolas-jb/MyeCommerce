import { Router } from "express";
import { ContenedorCarrito } from "../src/backend/services/products.js";

const routerCarrito = new Router();

const contenedorCarrito = new ContenedorCarrito(
  "./src/backend/persistence/carritos.json"
);

contenedorCarrito.get("/:id/productos", async (req, res) => {
  const id = req.params.id;
  const carrito = contenedorCarrito.getById(id);
  const productos = await contenedorCarrito.getProducts(id);
  if (carrito === undefined || carrito === null) {
    res.status(404).json({ error: "Carrito not found" });
  } else {
    res.status(200).json(productos);
  }
});

routerCarrito.post("/", async (req, res) => {
  const carrito = req.body;
  const id = await contenedorCarrito.save(carrito);
  res.status(200).send(`Se agregó un nuevo carrito cuyo id es ${id}`);
});

routerCarrito.post("/:id/productos", async (req, res) => {
  const id = req.params.id;
  const carrito = contenedorCarrito.getById(id);
  const productos = req.body;
  if (carrito === undefined || carrito === null) {
    res.status(404).json({ error: "Carrito not found" });
  } else {
    await contenedorCarrito.addProducts(id, productos);
    res
      .status(200)
      .send(`Se agregaron los productos al carrito cuyo id es ${id}`);
  }
});

routerCarrito.delete("/:id", async (req, res) => {
  const flagDelete = await contenedorCarrito.deleteById(req.params.id);
  if (flagDelete != null) {
    res.status(200).send(`El carrito cuyo id era ${req.params.id} fue borrado`);
  } else {
    res.status(404).json({ error: "Carrito no encontrado" });
  }
});

export { routerCarrito };
