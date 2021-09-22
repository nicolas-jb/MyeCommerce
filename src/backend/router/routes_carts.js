import { Router } from "express";
import { Carrito } from "../services/carrito.js"
import fetch from "node-fetch";
import {contenedorCarrito} from "../../backend/server.js"

const routerCarrito = new Router();

routerCarrito.get("/:id/productos", async (req, res) => {
  const idCarrito = req.params.id;
  const carrito = await contenedorCarrito.getById(idCarrito);
  const productos = await contenedorCarrito.getProducts(idCarrito);
  if (carrito === undefined || carrito === null) {
    res.status(404).json({ error: "Carrito not found" });
  } else {
    res.status(200).json(productos);
  }
});

routerCarrito.post("/", async (req, res) => {
  const carrito = new Carrito();
  const id = await contenedorCarrito.save(carrito);
  res.status(200).send(`Se agregó un nuevo carrito cuyo id es ${id}`);
});

routerCarrito.post("/:idCarrito/productos/:idProducto", async (req, res) => {
  const idCarrito = req.params.idCarrito;
  const idProducto = req.params.idProducto;
  const carrito = await contenedorCarrito.getById(idCarrito);
  let producto = await fetch(
    `http://localhost:8080/api/productos/${idProducto}`,
    {
      method: "GET",
    }
  ).then((res) => res.json());

  if (carrito === undefined || carrito === null) {
    res.status(404).json({ error: "Carrito not found" });
  } else if (producto === undefined || producto === null || producto.error != null) {
    res.status(404).json({ error: "Producto not found" });
  } else {
    await contenedorCarrito.addProducts(idCarrito, producto);
    res
      .status(200)
      .send(`Se agregó el producto cuyo id es ${idProducto} al carrito cuyo id es ${idCarrito}`);
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

routerCarrito.delete("/:idCarrito/productos/:idProducto", async (req, res) => {
  const idCarrito = req.params.idCarrito;
  const idProducto = req.params.idProducto;
  const carrito = await contenedorCarrito.getById(idCarrito);
  const flagDelete = await contenedorCarrito.deleteAProduct(idCarrito, idProducto);
  if (carrito === undefined || carrito === null) {
    res.status(404).json({ error: "Carrito not found" });
  } else if (flagDelete === undefined || flagDelete === null) {
    res.status(404).json({ error: "Producto not found" });
  } else {
    res
      .status(200)
      .send(`Se borró el producto cuyo id era ${idProducto} del carrito cuyo id es ${idCarrito}`);
  }
});

export { routerCarrito };
