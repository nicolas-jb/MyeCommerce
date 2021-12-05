import { contenedorProducto } from "../server.js";
import { Producto } from "../services/product.js";

export async function getAProduct(req, res) {
  const id = req.params.id;
  const producto = await contenedorProducto.getById(id);
  if (producto === undefined || producto === null) {
    res.status(404).json({ error: "Producto not found" });
  } else {
    res.status(200).json(producto);
  }
}

export async function getProducts(req, res) {
  const { id } = req.query;
  if (id === null || id === undefined) {
    const productos = await contenedorProducto.getAll();
    res.status(200).json(productos);
  } else {
    res.status(302).redirect(req.baseUrl + `/${id}`);
  }
}

export async function postProduct(req, res) {
  try {
    const { nombre, descripcion, codigo, foto, precio, stock } = req.body;
    const producto = new Producto(
      nombre,
      descripcion,
      codigo,
      foto,
      precio,
      stock
    );

    const id = await contenedorProducto.save(producto);
    res.status(200).send(`Se agregó un nuevo producto cuyo id es ${id}`);
  } catch (error) {
    res.status(500).json({ error: "Se ha producido un error" });
  }
}

export async function putProduct(req, res) {
  const { nombre, descripcion, codigo, foto, precio, stock } = req.body;
  const producto = new Producto(
    nombre,
    descripcion,
    codigo,
    foto,
    precio,
    stock
  );

  const id = req.params.id;

  const flagModify = await contenedorProducto.modify(id, producto);
  if (flagModify == null) {
    res.status(404).json({ error: "Producto no encontrado" });
  } else {
    res.status(200).send(`Se modificó el producto cuyo id es ${req.params.id}`);
  }
}

export async function deleteProduct(req, res) {
  const flagDelete = await contenedorProducto.deleteById(req.params.id);
  if (flagDelete != null) {
    res
      .status(200)
      .send(`El producto cuyo id era ${req.params.id} fue borrado`);
  } else {
    res.status(404).json({ error: "Producto no encontrado" });
  }
}
