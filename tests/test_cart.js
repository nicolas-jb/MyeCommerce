import { Carrito } from "../src/backend/services/products.js";

const productoEscuadra = {
    nombre: "Escuadra",
    id: 1,
    precio: 123.45,
    
}
  const productoCalculadora = {
    nombre: "Calculadora",
    id: 2,
    precio: 200
}
  
  const carrito = new Carrito();

  console.log(carrito.getProducts())
  carrito.addProducts(productoEscuadra)
  console.log(carrito.getProducts())
  carrito.addProducts([productoEscuadra, productoCalculadora])
  console.log(carrito.getProducts())
  carrito.deleteProducts();
  console.log(carrito.getProducts())
  carrito.addProducts([productoEscuadra, productoCalculadora])
  console.log(carrito.getProducts())
  carrito.deleteAProduct(2);
  console.log(carrito.getProducts())
  