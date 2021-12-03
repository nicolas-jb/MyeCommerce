import "../MongoDB/configdb.js";

class Contenedor {
  constructor(schema) {
    this.schema = schema;
  }

  async getAll() {
    try {
      return await this.schema.find();
    } catch (error) {
      return [];
    }
  }

  async save(element) {
    try {
      const savedElement = await this.schema.create(element);
      return savedElement._id.toString();
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async getById(id) {
    try {
      const element = await this.schema.find({ _id: id });
      if (element == undefined) {
        return null;
      }
      return element;
    } catch (error) {
      return null;
    }
  }

  async modify(id, element) {}

  async deleteAll() {
    try {
      await this.schema.deleteMany();
    } catch (e) {
      throw new Error();
    }
  }

  async deleteById(id) {
    try {
      const response = await this.schema.deleteOne({ _id: id });
      if (response.deletedCount == 0) {
        return null;
      } else {
        return true;
      }
    } catch (e) {
      return null;
    }
  }
}

/* -------------------------------------------------------------------------- */

class ContenedorProducto extends Contenedor {
  async modify(id, element) {
    try {
      const response = await this.schema.updateOne(
        { _id: id },
        {
          nombre: element.nombre,
          descripcion: element.descripcion,
          codigo: element.codigo,
          precio: element.precio,
          foto: element.foto,
          stock: element.stock,
        }
      );

      if (response.ok == 0) {
        return null;
      } else {
        return true;
      }
    } catch (e) {
      return null;
    }
  }
}

/* -------------------------------------------------------------------------- */

class ContenedorCarrito extends Contenedor {
  async getProducts(idCarrito) {
    try {
      const cart = await this.schema.findOne({ _id: idCarrito });
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
      await this.schema.updateOne(
        { _id: idCarrito },
        {
          productos: [],
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  async addProducts(idCarrito, producto) {
    try {
      let actualProducts = await this.schema.findOne(
        { _id: idCarrito },
        { productos: true }
      );
      actualProducts = actualProducts.productos;
      await this.schema.updateOne(
        { _id: idCarrito },
        {
          productos: actualProducts.concat(producto),
        }
      );
    } catch (error) {
      return null;
    }
  }

  async deleteAProduct(idCarrito, idProducto) {
    try {
      let savedProducts = await this.schema.findOne(
        { _id: idCarrito },
        { productos: true }
      );
      savedProducts = savedProducts.productos;

      const actualProducts = savedProducts.filter(function (pid) {
        return pid._id != idProducto;
      });

      if (actualProducts.length == savedProducts.length) {
        return null;
      }
      await this.schema.updateOne(
        { _id: idCarrito },
        {
          productos: actualProducts,
        }
      );
      return true;
    } catch (error) {
      return null;
    }
  }
}

export { ContenedorCarrito };
export { ContenedorProducto };
