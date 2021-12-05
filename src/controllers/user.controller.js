import { contenedorUsuario } from "../server.js";
import { contenedorProducto } from "../server.js";
import { User } from "../services/user.js";

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
  res.status(200).send(`Bienvenido ${user.nombre}`);
}

export function getFailLogin(req, res) {
  console.log("Error en el login");
  res.status(403).send("Error en el login");
}

export function getFailSignup(req, res) {
  console.log("Error en el Registro");
  res.status(403).send("Error en el Registro");
}

export function logout(req, res) {
  console.log("Logout");
  req.logout();
  res.status(200).send("Logout Exitoso!");
}

export function getProducts(req, res) {
  res.status(200).json(user.getProducts());
}

export async function postAProduct(req, res) {
  const idProducto = req.params.id || req.query.id;
  const producto = await contenedorProducto.getById(idProducto);
  if (producto === undefined || producto === null) {
    res.status(404).json({ error: "Producto not found" });
  } else {
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
  res.status(200).send(`Se han borrado los productos del carrito`);
}

export function deleteAProduct(req, res) {
  const idProducto = req.params.id || req.query.id;
  user.deleteAProduct(idProducto);
  res.status(200).send("Carrito Actualizado");
}

export function getPurchases(req, res) {
  res.status(200).json(user.getPurchases());
}

export async function postPurchase(req, res) {
  try {
    user.purchase();
    await contenedorUsuario.modify(req.user._id, user);
    res.status(200).send("Compra realizada!");
  } catch (err) {
    if (err.message == "No hay productos en el carrito") {
      res.status(200).send(err.message);
    } else {
      res.status(500).send("Se ha producido un error");
    }
  }
}
