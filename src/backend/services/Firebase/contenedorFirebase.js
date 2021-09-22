class Contenedor {
  constructor(query) {
    this.query = query;
  }

  async getAll() {
    try {
      const elements = [];
      const response = await this.query.get();
      response.docs.map((doc) => {
        const { element } = {
          element: doc.data(),
        };
        element.id = doc.id;

        elements.push(element);
      });
      return elements;
    } catch (error) {
      return [];
    }
  }

  async save(element) {
    let id;
    try {
      const elements = await this.getAll();
      const cantidadElementos = elements.length;
      if (cantidadElementos === 0) {
        id = 1;
      } else {
        id = Number(elements[cantidadElementos - 1].id) + 1;
      }
      const doc = this.query.doc(`${id}`);
      const elementToSave = this.getAttributes(element);
      await doc.create(elementToSave);
      return id;
    } catch (error) {
      console.log(error);
    }
  }

  async getById(id) {
    try {
      const doc = this.query.doc(`${id}`);
      const element = await doc.get();

      if (element.data() == undefined) {
        return null;
      }
      const correctedElement = element.data();
      correctedElement.id = id;
      return correctedElement;
    } catch (error) {
      return null;
    }
  }

  async modify(id, element) {
    try {
      const savedElement = await this.getById(id);
      if (savedElement === null) {
        return null;
      } else {
        const doc = this.query.doc(`${id}`);
        const elementToSave = this.getAttributes(element);
        elementToSave.timestamp = savedElement.timestamp;
        await doc.update(elementToSave);
        return true;
      }
    } catch (error) {
      return null;
    }
  }

  async deleteAll() {
    try {
      const responses = await this.getAll();
      responses.docs.map(async (response) => {
        const id = response.id;
        return await this.deleteById(id);
      });
    } catch (e) {
      throw new Error();
    }
  }

  async deleteById(id) {
    try {
      const response = await this.getById(id);
      if (response === null) {
        return null;
      } else {
        const doc = this.query.doc(`${id}`);
        await doc.delete();
        return true;
      }
    } catch (e) {
      return null;
    }
  }
}

/* -------------------------------------------------------------------------- */

class ContenedorProductoFirebase extends Contenedor {
  getAttributes(element) {
    return {
      nombre: element.nombre,
      descripcion: element.descripcion,
      codigo: element.codigo,
      precio: element.precio,
      foto: element.foto,
      stock: element.stock,
      timestamp: element.timestamp,
    };
  }
}

/* -------------------------------------------------------------------------- */

class ContenedorCarritoFirebase extends Contenedor {
  getAttributes(element) {
    return {
      timestamp: element.timestamp,
      productos: element.productos,
    };
  }
  async getProducts(idCarrito) {
    try {
      const cart = await this.getById(idCarrito);
      if (cart === null) {
        return null;
      }
      return cart.productos;
    } catch (error) {
      return null;
    }
  }

  async deleteProducts(idCarrito) {
    try {
      const cart = await this.getById(idCarrito);
      cart.productos = [];
      await this.modify(idCarrito, cart);
    } catch (error) {
      return null;
    }
  }

  async addProducts(idCarrito, producto) {
    try {
      const cart = await this.getById(idCarrito);
      cart.productos = cart.productos.concat(producto);
      await this.modify(idCarrito, cart);
    } catch (error) {
      return null;
    }
  }

  async deleteAProduct(idCarrito, idProducto) {
    try {
      const cart = await this.getById(idCarrito);
      const savedProducts = cart.productos;

      const actualProducts = savedProducts.filter(function (pid) {
        return pid.id != idProducto;
      });
      if (actualProducts.length == savedProducts.length) {
        return null;
      }
      cart.productos = actualProducts;
      await this.modify(idCarrito, cart);
      return true;
    } catch (error) {
      console.error(error);
    }
  }
}

export { ContenedorCarritoFirebase };
export { ContenedorProductoFirebase };
