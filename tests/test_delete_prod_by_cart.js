//This script is not a test itself but it serves as a first look to validate the operation

import { ContenedorCarrito } from "../src/backend/services/products.js";
import { Carrito } from "../src/backend/services/products.js";
import { Producto } from "../src/backend/services/products.js";

const contenedorCarrito = new ContenedorCarrito(
  "./src/backend/persistence/persistence_test/carritos_test_3.json"
);

const productoEscuadra = new Producto(
  "Escuadra",
  "Es una escuadra",
  1102,
  "https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png",
  123.45,
  2
);
const productoCalculadora = new Producto(
  "Calculadora",
  "Es una calculadora",
  209,
  "https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png",
  234.56,
  100
);

const carrito1 = new Carrito([productoEscuadra, productoCalculadora]);
const carrito2 = new Carrito([
  productoEscuadra,
  productoCalculadora,
  productoEscuadra,
]);

async function config() {
  await contenedorCarrito.save(carrito1);
  await contenedorCarrito.save(carrito2);
}

/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */

async function validateProductsCart(id) {
  await contenedorCarrito.deleteProducts(id);
  const products = await contenedorCarrito.getProducts(id);
  if (products.length === 0) {
    console.log("Test Passed");
  } else {
    console.error("Test Failed");
  }
}

async function test() {
  await config();
  await validateProductsCart(1);
  await validateProductsCart(2);
}

test();
