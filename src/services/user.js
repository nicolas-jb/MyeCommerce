import { Carrito } from "../services/cart.js";
import log4js from "../utils/logger.utils.js";

const loggerConsole = log4js.getLogger();
const loggerError = log4js.getLogger("errorFile");

export class User {
  constructor(username, password, nombre, direccion, edad, phone, avatar) {
    this.timestamp = Date.now();
    this.username = username;
    this.password = password;
    this.nombre = nombre;
    this.direccion = direccion;
    this.edad = edad;
    this.phone = phone;
    this.avatar = avatar;
    this.compras = [];
    this.cart = new Carrito();
  }

  getCart() {
    if (this.cart == null || this.cart == undefined) {
      this.cart = new Carrito();
    }
  }

  addProducts(products) {
    this.getCart();
    this.cart.addProducts(products);
  }

  deleteProducts() {
    this.getCart();
    this.cart.deleteProducts();
  }

  deleteAProduct(id) {
    this.getCart();
    return this.cart.deleteAProduct(id);
  }

  getProducts() {
    this.getCart();
    return this.cart.getProducts();
  }

  purchase() {
    if (this.cart.productos.length > 0) {
      this.compras.push(this.cart);
      this.cart = new Carrito();
    } else {
      const mjeLog = "Error Compra - No hay productos en el carrito"
      loggerConsole.error(mjeLog);
      loggerError.error(mjeLog);
      throw new Error("No hay productos en el carrito")
    }
  }

  getPurchases() {
    return this.compras;
  }
}
