import dotenv from "dotenv";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { DAOProductoDB, DAOUsuarioDB } from "./DAODB.js";
import { ProductoModel, UserModel } from "../models/model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

let daoProductos;
let daoUsuarios;

switch (process.env.MODE_PERSISTENCE.toLowerCase()) {
  case "mongo":
  default:
    daoProductos = new DAOProductoDB(ProductoModel);
    daoUsuarios = new DAOUsuarioDB(UserModel);
    await daoProductos.init();
    await daoUsuarios.init();
    break;
  /*Para la entrega anterior del proyecto la persistencia se hizo en Mongo, acá dejo el Factory para el caso
    que se quiera incorporar más métodos de persistencia. Simplemente habría que generar los DAOs
    correspondientes y carga la variable  de entorno con la nueva persistencia. 
    Cómo en la entrega tengo una sola forma de persistencia también la establecí cómo default*/
}

export class ProductoDAOFactory {
  getDao() {
    return daoProductos;
  }
}

export class UserDAOFactory {
  getDao() {
    return daoUsuarios;
  }
}
