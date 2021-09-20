//This script is not a test itself but it serves as a first look to validate the operation

import { ContenedorCarrito } from "../src/backend/services/FS/contenedorFS.js";
import { ContenedorProducto } from "../src/backend/services/FS/contenedorFS.js";
import { Carrito } from "../src/backend/services/carrito.js";
import { Producto } from "../src/backend/services/producto.js";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const contenedorProducto = new ContenedorProducto(
  path.join(
    __dirname,
    "../src/backend/persistence/persistence_test/productos_test.json"
  )
);
const contenedorCarrito = new ContenedorCarrito(
  path.join(
    __dirname,
    "../src/backend/persistence/persistence_test/carritos_test.json"
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

const carrito1 = new Carrito();
const carrito2 = new Carrito();

/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */

async function testProducto() {
  await contenedorProducto.deleteAll();
  await contenedorProducto.getAll();
  await contenedorProducto.save(productoEscuadra);
  await contenedorProducto.save(productoCalculadora);
  await contenedorProducto.save(productoEscuadra);
  await contenedorProducto.getAll();
  await contenedorProducto.getById(2);
  await contenedorProducto.getById(10); // testeo un id que no está
  await contenedorProducto.deleteAll();
  await contenedorProducto.getAll();
  await contenedorProducto.save(productoEscuadra);
  await contenedorProducto.save(productoCalculadora);
  await contenedorProducto.getAll();
  await contenedorProducto.deleteById(4);
  await contenedorProducto.getAll();
  await contenedorProducto.save(productoEscuadra);
  await contenedorProducto.save(productoCalculadora);
  await contenedorProducto.getByPosition(2);
  await contenedorProducto.getByPosition(4);
  await contenedorProducto.modify(7, productoEscuadra);
  await contenedorProducto.getAll();
}

async function testCarrito() {
  const pEs6 = await contenedorProducto.getById(6);
  const pEs7 = await contenedorProducto.getById(7);
  const pCalc = await contenedorProducto.getById(5);

  await contenedorCarrito.deleteAll();
  await contenedorCarrito.save(carrito1);
  await contenedorCarrito.save(carrito2);
  await contenedorCarrito.addProducts(1, [
    await contenedorProducto.getByPosition(0),
    await contenedorProducto.getByPosition(2),
  ]);
  await contenedorCarrito.addProducts(2, [pEs6, pCalc, pEs7]);
  await contenedorCarrito.getAll();
  await contenedorCarrito.getById(2);
  await contenedorCarrito.getById(10); // testeo un id que no está
  await contenedorCarrito.deleteAll();
  await contenedorCarrito.getAll();
  await contenedorCarrito.save(carrito1);
  await contenedorCarrito.save(carrito2);

  await contenedorCarrito.addProducts(3, [
    await contenedorProducto.getByPosition(0),
    await contenedorProducto.getByPosition(2),
  ]);
  await contenedorCarrito.getAll();
  await contenedorCarrito.deleteById(4);
  await contenedorCarrito.getAll();
  await contenedorCarrito.getByPosition(0);
  await contenedorCarrito.getByPosition(4);
  await contenedorCarrito.modify(3, carrito1);
  await contenedorCarrito.addProducts(3, [pEs6, pCalc, pEs7]);
  await contenedorCarrito.getAll();
}

async function validateCarrito() {
  await testCarrito();
  const carritoToCompare = new ContenedorCarrito(
    path.join(
      __dirname,
      "../src/backend/persistence/persistence_test/carritos_test_to_compare.json"
    )
  );
  const validLecture = await carritoToCompare.getAll();
  const lecturaTest = await contenedorCarrito.getAll();
  await validateRead(validLecture, lecturaTest);
}

async function validateProducto() {
  await testProducto();
  const productoToCompare = new ContenedorProducto(
    path.join(
      __dirname,
      "../src/backend/persistence/persistence_test/productos_test_to_compare.json"
    )
  );
  const validLecture = await productoToCompare.getAll();
  const lecturaTest = await contenedorProducto.getAll();
  await validateRead(validLecture, lecturaTest);
}

async function validateRead(obj1, obj2) {
  if (Object.entries(obj1).toString() === Object.entries(obj2).toString()) {
    console.log("Test Passed");
  } else {
    console.error("Test Failed");
  }
}

async function test() {
  await validateProducto();
  await validateCarrito();
}

test();
