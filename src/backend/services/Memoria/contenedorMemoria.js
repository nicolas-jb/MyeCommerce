class Contenedor {
  maxIdSaved = 0;

  constructor(array) {
    this.array = array;
  }

  getAll() {
    return this.array;
  }

  save(element) {
    let id;
    if (this.array.length == 0) {
      id = 1;
    } else {
      let max = -1;
      this.array.map((element) => {
        if (element.id > max) {
          max = element.id;
        }
      });
      id = max+1;
    }
    element.id = id;
    this.array.push(element);
    return id;
  }

  getById(id) {
    const savedElements = this.getAll();
    const elementId = savedElements.filter(function (sp) {
      return parseInt(sp.id) == id;
    })[0];
    if (elementId == undefined) {
      return null;
    }
    return elementId;
  }

  modify(id, element) {
    const correctedId = Number(id);
    const timestamp = this.getById(correctedId).timestamp;
    element.timestamp = timestamp;
    element.id = correctedId;
    this.deleteById(correctedId);
    this.array.push(element);
    return true;
  }

  deleteAll() {
    this.array = [];
  }

  deleteById(id) {
    const savedElements = this.getAll();
    const actualElements = savedElements.filter(function (sp) {
      return parseInt(sp.id) !== Number(id);
    });
    if (actualElements.length == savedElements.length) {
      return null;
    }
    this.array = actualElements;
    return true;
  }
}

/* -------------------------------------------------------------------------- */

class ContenedorProductoMemoria extends Contenedor {}

/* -------------------------------------------------------------------------- */

class ContenedorCarritoMemoria extends Contenedor {
  getProducts(idCarrito) {
    const carritoById = this.getById(idCarrito);
    if (carritoById === null) {
      return null;
    }
    return carritoById.productos;
  }

  async deleteProducts(idCarrito) {
    const carritoById = await this.getById(idCarrito);
    if (carritoById === null) {
      return null;
    }
    carritoById.productos = [];
  }

  async addProducts(idCarrito, productos) {
    const carritoById = await this.getById(idCarrito);
    if (carritoById == null) {
      return null;
    }
    carritoById.productos = carritoById.productos.concat(productos);
  }

  async deleteAProduct(idCarrito, idProducto) {
    const id = Number(idProducto);
    const carritoById = await this.getById(Number(idCarrito));
    if (carritoById == null) {
      return null;
    }
    const actualProducts = carritoById.productos.filter(function (pid) {
      return pid.id != id;
    });

    if (actualProducts.length == carritoById.productos.length) {
      return null;
    }
    carritoById.productos = actualProducts;
    this.modify(Number(idCarrito), carritoById);
    return true;
  }
}

export { ContenedorCarritoMemoria };
export { ContenedorProductoMemoria };
