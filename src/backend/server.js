import express, { json, query, urlencoded } from "express";
import emoji from "node-emoji";
import { routerProductos } from "../backend/router/routes_products.js";
import { routerCarrito } from "../backend/router/routes_carts.js";
import { ContenedorCarritoFS } from "./services/FS/contenedorFS.js";
import { ContenedorProductoFS } from "./services/FS/contenedorFS.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

//instance variables
let contenedorCarrito;
let contenedorProducto;
let contenedorCarritoFS;
let contenedorProductoFS;
let contenedorCarritoMongo;
let contenedorProductoMongo;
let contenedorCarritoFirebase;
let contenedorProductoFirebase;
let contenedorCarritoMemoria;
let contenedorProductoMemoria;
let contenedorCarritoActualizado;
let contenedorProductoActualizado;

//mode flags - first time configuration
let flagFS = true;
let flagMongo = true;
let flagFirebase = true;
let flagMemoria = true;

//persistence's modes
const persistenceModes = {
  modes: {
    1: "FS",
    2: "MONGODB",
    3: "FIREBASE",
    4: "Memoria",
  },
  quantity: 4,
};

async function setPersistenceMode(mode) {
  switch (mode) {
    case 1: {
      if (flagFS) {
        flagFS = false;
        contenedorCarritoFS = new ContenedorCarritoFS(
          path.join(__dirname, "./persistence/persistence_FS/carritos.json")
        );
        contenedorProductoFS = new ContenedorProductoFS(
          path.join(__dirname, "./persistence/persistence_FS/productos.json")
        );
      }
      contenedorCarritoActualizado = contenedorCarritoFS;
      contenedorProductoActualizado = contenedorProductoFS;
      break;
    }
    case 2: {
      if (flagMongo) {
        flagMongo = false;
        const moduleContenedor = await import(
          "./services/MongoDB/contenedorMongo.js"
        );
        const moduleSchema = await import(
          "./persistence/persistence_MongoDB/models/model.js"
        );
        contenedorCarritoMongo = new moduleContenedor.ContenedorCarritoMongo(
          moduleSchema.CarritoModel
        );
        contenedorProductoMongo = new moduleContenedor.ContenedorProductoMongo(
          moduleSchema.ProductoModel
        );
      }
      contenedorCarritoActualizado = contenedorCarritoMongo;
      contenedorProductoActualizado = contenedorProductoMongo;
      break;
    }
    case 3: {
      if (flagFirebase) {
        flagFirebase = false;
        const moduleContenedor = await import(
          "./services/Firebase/contenedorFirebase.js"
        );
        const query = await import("./services/Firebase/config.js");
        contenedorCarritoFirebase =
          new moduleContenedor.ContenedorCarritoFirebase(query.queryCarritos);
        contenedorProductoFirebase =
          new moduleContenedor.ContenedorProductoFirebase(query.queryProductos);
      }
      contenedorCarritoActualizado = contenedorCarritoFirebase;
      contenedorProductoActualizado = contenedorProductoFirebase;
      break;
    }
    case 4: {
      if (flagMemoria) {
        flagMemoria = false;
        const moduleContenedor = await import(
          "./services/Memoria/contenedorMemoria.js"
        );

        contenedorCarritoMemoria =
          new moduleContenedor.ContenedorCarritoMemoria([]);
        contenedorProductoMemoria =
          new moduleContenedor.ContenedorProductoMemoria([]);
      }
      contenedorCarritoActualizado = contenedorCarritoMemoria;
      contenedorProductoActualizado = contenedorProductoMemoria;
      break;
    }
  }

  contenedorCarrito = contenedorCarritoActualizado;
  contenedorProducto = contenedorProductoActualizado;
}

//set default persistence mode
setPersistenceMode(1);

app.use(json());
app.use(urlencoded({ extended: true }));

app.use("/api/productos", routerProductos);
app.use("/api/carrito", routerCarrito);

export const PORT = 8080;

app.post("/", async (req, res) => {
  let { idMode } = req.body;
  if (idMode > persistenceModes.quantity) {
    res.status(404).json({ error: "Mode not found" });
  } else {
    await setPersistenceMode(idMode);
    res.status(200).json({
      mode: `Modo de persistencia de datos: ${persistenceModes.modes[idMode]}`,
    });
  }
});

app.use((req, res) => {
  res.status(404).json({
    error: -2,
    descripción: `ruta ${req.url} método ${req.method} no implementado`,
  });
});

app.listen(PORT, () => {
  console.log(emoji.get("computer"), "Server on " + PORT);
});

export { contenedorCarrito };
export { contenedorProducto };
