import { contenedorUsuario } from "../server.js";
import { contenedorProducto } from "../server.js";
import { User } from "../services/user.js";
import log4js from "../utils/logger.utils.js";
import dotenv from "dotenv";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { envioMail, armarCuerpoMailCompra } from "../utils/mailer.utils.js";
import { envioMje } from "../utils/twilio.utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const loggerConsole = log4js.getLogger();
const loggerError = log4js.getLogger("errorFile");

let user;

export function getUser(req, res) {
  user = new User(
    req.user.username,
    req.user.password,
    req.user.nombre,
    req.user.direccion,
    req.user.edad,
    req.user.phone,
    req.user.avatar
  );
  user.timestamp = req.user.timestamp;
  user.compras = req.user.compras;
  loggerConsole.info(`El usuario ${user.nombre} se ha logueado`);
  res.status(200).send(`Bienvenido ${user.nombre}`);
}

export function getFailLogin(req, res) {
  loggerConsole.error("Falló el login");
  loggerError.error("Falló el login");
  res.status(403).send("Error en el login");
}

export function getFailSignup(req, res) {
  loggerConsole.error("Falló el registro");
  loggerError.error("Falló el registro");

  res.status(403).send("Error en el Registro");
}

export function logout(req, res) {
  loggerConsole.info(`Ruta ${req.url} - Método ${req.method}`);
  req.logout();
  res.status(200).send("Logout Exitoso!");
}

export function getProducts(req, res) {
  loggerConsole.info(`Ruta ${req.url} - Método ${req.method}`);
  res.status(200).json(user.getProducts());
}

export async function postAProduct(req, res) {
  const idProducto = req.params.id || req.query.id;
  const producto = await contenedorProducto.getById(idProducto);
  if (producto === undefined || producto === null) {
    const mjeLog = "No se encontró el producto";
    loggerConsole.error(mjeLog);
    loggerError.error(mjeLog);
    res.status(404).json({ error: mjeLog });
  } else {
    loggerConsole.info(`Ruta ${req.url} - Método ${req.method}`);
    user.addProducts(producto);
    res
      .status(200)
      .send(
        `Se ha añadido al carrito del usuario el producto de id ${idProducto}`
      );
  }
}

export function deleteProducts(req, res) {
  user.deleteProducts();
  loggerConsole.info(`Ruta ${req.url} - Método ${req.method}`);
  res.status(200).send(`Se han borrado los productos del carrito`);
}

export function deleteAProduct(req, res) {
  const idProducto = req.params.id || req.query.id;
  user.deleteAProduct(idProducto);
  loggerConsole.info(`Ruta ${req.url} - Método ${req.method}`);
  res.status(200).send("Carrito Actualizado");
}

export function getPurchases(req, res) {
  loggerConsole.info(`Ruta ${req.url} - Método ${req.method}`);
  res.status(200).json(user.getPurchases());
}

export async function postPurchase(req, res) {
  try {
    const compra = user.getProducts();
    user.purchase();
    await contenedorUsuario.modify(req.user._id, user);
    loggerConsole.info(`Ruta ${req.url} - Método ${req.method}`);
    const asunto = `Nuevo pedido de ${user.nombre} (${user.username})`
    envioMail(
      process.env.MAIL_ADMIN,
      asunto,
      armarCuerpoMailCompra(compra)
    );
    envioMje(process.env.SMS_FROM, user.phone, "Su pedido ha sido recibido y se encuentra en proceso!")
    envioMje(process.env.WP_FROM, process.env.WP_TO, asunto)
    res.status(200).send("Compra realizada!");
  } catch (err) {
    if (err.message == "No hay productos en el carrito") {
      const mjeLog = "No se encontró el producto";
      loggerConsole.error(mjeLog);
      loggerError.error(mjeLog);
      res.status(200).send(err.message);
    } else {
      const mjeLog = "Se ha producido un error";
      loggerConsole.error(mjeLog);
      loggerError.error(mjeLog);
      res.status(500).send(mjeLog);
    }
  }
}
