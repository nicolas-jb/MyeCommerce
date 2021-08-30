//This script is not a test itself but it serves as a first look to validate the operation

import { ContenedorCarrito } from "../src/backend/services/products.js";
import { Carrito } from "../src/backend/services/products.js";
import { Producto } from "../src/backend/services/products.js";

const contenedorCarrito = new ContenedorCarrito(
  "./src/backend/persistence/persistence_test/carritos_test_4.json"
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

async function config() {
  await contenedorCarrito.deleteAll();
  await contenedorCarrito.save(carrito1);
}

/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */

async function validateProductsCart(id) {
  await contenedorCarrito.addProducts(id, [
    productoCalculadora,
    productoCalculadora,
    productoCalculadora,
    productoCalculadora,
  ]);
  const products = await contenedorCarrito.getProducts(id);
  if (products.length === 6) {
    console.log("Test Passed");
  } else {
    console.error("Test Failed");
  }
}

async function test() {
  await config();
  await validateProductsCart(1);
}

test();
