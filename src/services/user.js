import { Carrito } from "../services/cart.js"

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
      this.compras =[]
      this.cart = new Carrito()
    }

    addProducts(products) {
        this.cart.addProducts(products);
      }
    
      deleteProducts() {
        this.cart.deleteProducts;
      }
    
      deleteAProduct(id) {
        return this.cart.deleteAProduct(id);
      }
    
      getProducts() {
        return this.cart.getProducts();
      }

      purchase(){
          this.compras.push(this.cart);
          this.cart = new Carrito()
      }

      getPurchases(){
          return this.compras();
      }
  }

