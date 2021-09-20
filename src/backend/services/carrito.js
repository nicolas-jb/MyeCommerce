export class Carrito {
    constructor() {
      this.timestamp = Date.now();
      this.productos = [];
    }
  
    addProducts(products) {
      this.productos = this.productos.concat(products);
    }
  
    deleteProducts() {
      this.productos = [];
    }
  
    deleteAProduct(id) {
      const actualProducts = this.productos.filter(function (pid) {
        return pid.id != id;
      });
      this.productos = actualProducts;
    }
  
    getProducts() {
      return this.productos;
    }
  }