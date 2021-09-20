import express, { json, urlencoded } from "express";
import emoji from "node-emoji";
import { routerProductos } from "../backend/router/routes_products.js";
import { routerCarrito } from "../backend/router/routes_carts.js";
import { ContenedorCarrito } from "./services/FS/contenedorFS.js";
import { ContenedorProducto } from "./services/FS/contenedorFS.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
let contenedorCarrito;
let contenedorProducto;

const persistenceModes = {
  modes: {
    1: "FS",
    2: "MONGODB",
    3: "FIREBASE",
    4: "MYSQL",
    5: "SQLITE",
  },
  quantity: 5,
};

function setPersistenceMode(mode) {
  switch (mode) {
    case 1: {
      contenedorCarrito = new ContenedorCarrito(
        path.join(__dirname, "./persistence/persistence_FS/carritos.json")
      );
      contenedorProducto = new ContenedorProducto(
        path.join(__dirname, "./persistence/persistence_FS/productos.json")
      );
    }
  }
}

//set default persistence mode
setPersistenceMode(1);

app.use(json());
app.use(urlencoded({ extended: true }));

app.use("/api/productos", routerProductos);
app.use("/api/carrito", routerCarrito);

export const PORT = 8080;

app.post("/", (req, res) => {
  let { idMode } = req.body;
  if (idMode > persistenceModes.quantity) {
    res.status(404).json({ error: "Mode not found" });
  } else {
    setPersistenceMode(idMode);
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
