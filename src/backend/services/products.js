import { promises } from "fs";
import path from "path";

const moduleURL = new URL(import.meta.url);
const __dirname = path.dirname(moduleURL.pathname);

class Contenedor {
  maxIdSaved = 0;
  constructor(nombreArchivo) {
    this.ruta =
      path.join(__dirname, "../", "/persistence") + `/${nombreArchivo}.txt`;
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

class Producto {
  constructor(nombre, descripcion, codigo, foto, precio, stock) {
    this.timestamp = Date.now();
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.codigo = codigo;
    this.foto = foto;
    this.precio = precio;
    this.stock = stock;
  }
}

class Carrito {
  constructor(productos) {
    this.timestamp = Date.now();
    this.productos = productos;
  }
}

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

    await super.modify(id);
    return true;
  }
}

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
    await super.modify(id);
    return true;
  }
}

export { Contenedor };
export { ContenedorCarrito };
export { ContenedorProducto };
export { Carrito };
export { Producto };

/* -------------------------------------------------------------------------- */
/*                                  SET TEST                                  */
/* -------------------------------------------------------------------------- */

/*const contenedorProducto = new ContenedorProducto("productos");
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

const contenedorCarrito = new ContenedorCarrito("carritos");
const carrito1 = new Carrito([productoEscuadra, productoCalculadora]);
const carrito2 = new Carrito([
  productoEscuadra,
  productoCalculadora,
  productoEscuadra,
]);

async function testCarrito() {
  await contenedorCarrito.deleteAll();
  console.log(await contenedorCarrito.getAll());
  console.log(await contenedorCarrito.save(carrito1));
  console.log(await contenedorCarrito.save(carrito2));
  console.log(await contenedorCarrito.save(carrito1));
  console.log(await contenedorCarrito.getAll());
  console.log(await contenedorCarrito.getById(2));
  console.log(await contenedorCarrito.getById(10)); // testeo un id que no está
  await contenedorCarrito.deleteAll();
  console.log(await contenedorCarrito.getAll());
  console.log(await contenedorCarrito.save(carrito1));
  console.log(await contenedorCarrito.save(carrito2));
  console.log(await contenedorCarrito.getAll());
  await contenedorCarrito.deleteById(4);
  console.log(await contenedorCarrito.getAll());
  console.log(await contenedorCarrito.save(carrito1));
  console.log(await contenedorCarrito.save(carrito2));
  console.log(await contenedorCarrito.getByPosition(2));
  console.log(await contenedorCarrito.getByPosition(4));
  console.log(await contenedorCarrito.modify(7, carrito1));
  console.log(await contenedorCarrito.getAll());
}

async function testProducto() {
  await contenedorProducto.deleteAll();
  console.log(await contenedorProducto.getAll());
  console.log(await contenedorProducto.save(productoEscuadra));
  console.log(await contenedorProducto.save(productoCalculadora));
  console.log(await contenedorProducto.save(productoEscuadra));
  console.log(await contenedorProducto.getAll());
  console.log(await contenedorProducto.getById(2));
  console.log(await contenedorProducto.getById(10)); // testeo un id que no está
  await contenedorProducto.deleteAll();
  console.log(await contenedorProducto.getAll());
  console.log(await contenedorProducto.save(productoEscuadra));
  console.log(await contenedorProducto.save(productoCalculadora));
  console.log(await contenedorProducto.getAll());
  await contenedorProducto.deleteById(4);
  console.log(await contenedorProducto.getAll());
  console.log(await contenedorProducto.save(productoEscuadra));
  console.log(await contenedorProducto.save(productoCalculadora));
  console.log(await contenedorProducto.getByPosition(2));
  console.log(await contenedorProducto.getByPosition(4));
  console.log(await contenedorProducto.modify(7, productoEscuadra));
  console.log(await contenedorProducto.getAll());
}

async function test() {
  await testCarrito();
  await testProducto();
}

test(); */
