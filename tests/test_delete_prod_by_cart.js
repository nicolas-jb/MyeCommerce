//This script is not a test itself but it serves as a first look to validate the operation

import { ContenedorCarrito } from "../src/backend/services/FS/contenedorFS.js";
import { Carrito } from "../src/backend/services/carrito.js";
import { Producto } from "../src/backend/services/producto.js";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const contenedorCarrito = new ContenedorCarrito(
  path.join(
    __dirname,
    "../src/backend/persistence/persistence_test/carritos_test_3.json"
  )
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

productoEscuadra.id = 1;
productoEscuadra.timestamp = 1;
productoCalculadora.id = 2;
productoCalculadora.timestamp = 2;

const carrito1 = new Carrito();
const carrito2 = new Carrito();

async function config() {
  await contenedorCarrito.deleteAll();
  carrito1.addProducts([productoCalculadora, productoEscuadra]);
  carrito2.addProducts([
    productoEscuadra,
    productoCalculadora,
    productoEscuadra,
  ]);

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
