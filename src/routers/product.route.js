import { Router } from "express";
import * as AuthController from "../controllers/product.controller.js";
import * as AuthMiddleware from '../middlewares/admin.middleware.js'

const routerProductos = new Router();

routerProductos.use(AuthMiddleware.checkAuthentication)

routerProductos.get("/:id", AuthController.getAProduct); //PONER LA VALIDACION QUE SOLO LO PUEDE VER EL ADMIN
routerProductos.get("/", AuthController.getProducts);
routerProductos.post("/", AuthController.postProduct);
routerProductos.put("/:id", AuthController.putProduct);
routerProductos.delete("/:id", AuthController.deleteProduct);

export { routerProductos };
