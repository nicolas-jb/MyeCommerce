import { Router } from "express";
import { ContenedorProducto } from "../services/FS/contenedorFS.js";
import { Producto } from "../services/producto.js";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const routerProductos = new Router();

const contenedorProducto = new ContenedorProducto(
  path.join(__dirname, "../persistence/productos.json")
);

function errorAuth(ruta, method) {
  return {
    error: -1,
    descripcion: `ruta ${ruta} método ${method} no autorizada`,
  };
}

routerProductos.get("/:id", async (req, res) => {
  const id = req.params.id;
  const producto = await contenedorProducto.getById(id);
  if (producto === undefined || producto === null) {
    res.status(404).json({ error: "Producto not found" });
  } else {
    res.status(200).json(producto);
  }
});

routerProductos.get("/", async (req, res) => {
  const { id } = req.query;
  if (id === null || id === undefined) {
    const productos = await contenedorProducto.getAll();
    res.status(200).json(productos);
  } else {
    res.status(302).redirect(req.baseUrl + `/${id}`);
  }
});

routerProductos.post("/", async (req, res) => {
  const { nombre, descripcion, codigo, foto, precio, stock } = req.body;
  const producto = new Producto(
    nombre,
    descripcion,
    codigo,
    foto,
    precio,
    stock
  );
  const { user } = req.body;
  if (user === "admin") {
    const id = await contenedorProducto.save(producto);
    res.status(200).send(`Se agregó un nuevo producto cuyo id es ${id}`);
  } else {
    res.status(403).send(errorAuth(req.originalUrl, req.method));
  }
});

routerProductos.put("/:id", async (req, res) => {
  const producto = req.body;
  const id = Number(req.params.id);
  if (producto.user === "admin") {
    const flagModify = await contenedorProducto.modify(id, producto);
    if (flagModify == null) {
      res.status(404).json({ error: "Producto no encontrado" });
    } else {
      res
        .status(200)
        .send(`Se modificó el producto cuyo id es ${req.params.id}`);
    }
  } else {
    res.status(403).send(errorAuth(req.originalUrl, req.method));
  }
});

routerProductos.delete("/:id", async (req, res) => {
  const producto = req.body;
  if (producto.user === "admin") {
    const flagDelete = await contenedorProducto.deleteById(req.params.id);
    if (flagDelete != null) {
      res
        .status(200)
        .send(`El producto cuyo id era ${req.params.id} fue borrado`);
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } else {
    res.status(403).send(errorAuth(req.originalUrl, req.method));
  }
});

export { routerProductos };
