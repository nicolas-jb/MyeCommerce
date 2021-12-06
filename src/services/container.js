import "../configdb.js";
import log4js from "../utils/logger.utils.js";

const loggerConsole = log4js.getLogger();
const loggerError = log4js.getLogger("errorFile");

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
      loggerConsole.error(error);
      loggerError.error(error);
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
    } catch (error) {
      loggerConsole.error(error);
      loggerError.error(error);
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

class ContenedorUsuario extends Contenedor {
  async getByEmail(email) {
    try {
      const element = await this.schema.findOne({ username: email });
      if (element == undefined) {
        return null;
      }
      return element;
    } catch (error) {
      return null;
    }
  }

  async modify(id, element) {
    try {
      const response = await this.schema.updateOne(
        { _id: id },
        {
          compras: element.compras,
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

export { ContenedorProducto };
export { ContenedorUsuario };
