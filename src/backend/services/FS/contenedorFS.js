import { promises } from "fs";

class Contenedor {
  maxIdSaved = 0;

  constructor(ruta) {
    this.ruta = ruta;
  }

  async getAll() {
    try {
      const savedElements = await promises.readFile(this.ruta, "utf-8");
      return JSON.parse(savedElements);
    } catch (error) {
      return [];
    }
  }

  async save() {
    try {
      const savedElements = await this.getAll();
      if (this.maxIdSaved == 0) {
        if (savedElements.length > 0) {
          this.maxIdSaved =
            Math.max.apply(
              null,
              savedElements.map((element) => element.id)
            ) + 1;
        } else {
          this.maxIdSaved++;
        }
      } else {
        this.maxIdSaved++;
      }

      const newElement = {
        ...this.newElement,
        id: this.maxIdSaved,
      };
      savedElements.push(newElement);

      await promises.writeFile(
        this.ruta,
        JSON.stringify(savedElements, null, 2)
      );
    } catch (e) {
      console.error(e);
      throw new Error();
    }
  }

  async getById(number) {
    try {
      const savedElements = await this.getAll();
      const elementId = savedElements.filter(function (sp) {
        return parseInt(sp.id) == number;
      })[0];
      if (elementId == undefined) {
        return null;
      }
      return elementId;
    } catch (error) {
      return null;
    }
  }

  async modify(id) {
    try {
      const erasedElement = await this.deleteById(id);
      if (erasedElement == null) {
        return null;
      } else {
        const newProduct = {
          ...this.newElement,
          id: id,
        };

        const savedElements = await this.getAll();
        savedElements.push(newProduct);

        await promises.writeFile(
          this.ruta,
          JSON.stringify(savedElements, null, 2)
        );
        return true;
      }
    } catch (e) {
      return null;
    }
  }

  async getByPosition(number) {
    try {
      const savedElements = await this.getAll();
      if (savedElements.length <= number) {
        return null;
      } else {
        return savedElements[number];
      }
    } catch (error) {
      return null;
    }
  }

  async deleteAll() {
    try {
      await promises.writeFile(this.ruta, "");
    } catch (e) {
      throw new Error();
    }
  }

  async deleteById(number) {
    try {
      const savedElements = await this.getAll();
      const erasedElement = await this.getById(number);
      const actualElements = savedElements.filter(function (sp) {
        return parseInt(sp.id) != number;
      });

      if (erasedElement != null) {
        await promises.writeFile(
          this.ruta,
          JSON.stringify(actualElements, null, 2)
        );
        return true;
      }

      return null;
    } catch (e) {
      return null;
    }
  }
}

/* -------------------------------------------------------------------------- */

class ContenedorProducto extends Contenedor {
  async save(product) {
    this.newElement = {
      nombre: product.nombre,
      timestamp: product.timestamp,
      descripcion: product.descripcion,
      codigo: product.codigo,
      precio: product.precio,
      foto: product.foto,
      stock: product.stock,
    };

    await super.save();
    return this.maxIdSaved;
  }

  async modify(id, product) {
    this.newElement = {
      nombre: product.nombre,
      timestamp: product.timestamp,
      descripcion: product.descripcion,
      codigo: product.codigo,
      precio: product.precio,
      foto: product.foto,
      stock: product.stock,
    };

    return await super.modify(id);
  }
}

/* -------------------------------------------------------------------------- */

class ContenedorCarrito extends Contenedor {
  async save(carrito) {
    this.newElement = {
      timestamp: carrito.timestamp,
      productos: carrito.productos,
    };

    await super.save();
    return this.maxIdSaved;
  }

  async modify(id, carrito) {
    this.newElement = {
      timestamp: carrito.timestamp,
      productos: carrito.productos,
    };
    return await super.modify(id);
  }

  async getProducts(idCarrito) {
    const carritoById = await this.getById(idCarrito);
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
    this.newElement = {
      timestamp: carritoById.timestamp,
      productos: carritoById.productos,
    };
    return await super.modify(idCarrito);
  }

  async addProducts(idCarrito, productos) {
    const carritoById = await this.getById(idCarrito);
    if (carritoById == null) {
      return null;
    }
    carritoById.productos = carritoById.productos.concat(productos);
    this.newElement = {
      timestamp: carritoById.timestamp,
      productos: carritoById.productos,
    };
    return await super.modify(idCarrito);
  }

  async deleteAProduct(idCarrito, idProducto) {
    const carritoById = await this.getById(idCarrito);
    if (carritoById == null) {
      return null;
    }
    const actualProducts = carritoById.productos.filter(function (pid) {
      return pid.id != idProducto;
    });

    if (actualProducts.length == carritoById.productos.length) {
      return null
    }

    this.newElement = {
      timestamp: carritoById.timestamp,
      productos: actualProducts,
    };

    return await super.modify(idCarrito);
  }
}

export { Contenedor };
export { ContenedorCarrito };
export { ContenedorProducto };

