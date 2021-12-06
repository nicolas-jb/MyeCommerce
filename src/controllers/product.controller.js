import { contenedorProducto } from "../server.js";
import { Producto } from "../services/product.js";
import log4js from "../utils/logger.utils.js";

const loggerConsole = log4js.getLogger();
const loggerError = log4js.getLogger("errorFile");

export async function getAProduct(req, res) {
  const id = req.params.id;
  const producto = await contenedorProducto.getById(id);
  if (producto === undefined || producto === null) {
    const mjeLog = "No se encontró el producto"
    loggerConsole.error(mjeLog);
    loggerError.error(mjeLog);
    res.status(404).json({ error: mjeLog });
  } else {
    loggerConsole.info(`Ruta ${req.url} - Método ${req.method}`)
    res.status(200).json(producto);
  }
}

export async function getProducts(req, res) {
  const { id } = req.query;
  if (id === null || id === undefined) {
    const productos = await contenedorProducto.getAll();
    loggerConsole.info(`Ruta ${req.url} - Método ${req.method}`)
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
    loggerConsole.info(`Ruta ${req.url} - Método ${req.method}`)
    res.status(200).send(`Se agregó un nuevo producto cuyo id es ${id}`);
  } catch (error) {
    const mjeLog = "Se ha producido un error"
    loggerConsole.error(mjeLog);
    loggerError.error(mjeLog);
    res.status(500).json({ error: mjeLog });
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
    const mjeLog = "No se encontró el producto"
    loggerConsole.error(mjeLog);
    loggerError.error(mjeLog);
    res.status(404).json({ error: mjeLog });
  } else {
    loggerConsole.info(`Ruta ${req.url} - Método ${req.method}`)
    res.status(200).send(`Se modificó el producto cuyo id es ${req.params.id}`);
  }
}

export async function deleteProduct(req, res) {
  const flagDelete = await contenedorProducto.deleteById(req.params.id);
  if (flagDelete != null) {
    loggerConsole.info(`Ruta ${req.url} - Método ${req.method}`)
    res
      .status(200)
      .send(`El producto cuyo id era ${req.params.id} fue borrado`);
  } else {
    const mjeLog = "No se encontró el producto"
    loggerConsole.error(mjeLog);
    loggerError.error(mjeLog);
    res.status(404).json({ error: mjeLog });
  }
}
