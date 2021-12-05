import { Router } from "express";
import passport from '../utils/passport.utils.js'
import * as AuthController from "../controllers/user.controller.js";
import * as AuthMiddleware from '../middlewares/user.middlewares.js'

const routerUsuario = new Router();

//routerUsuario.get('/login',AuthController.getLogin)
routerUsuario.post('/login', passport.authenticate('login',{failureRedirect:'/api/user/failLogin'}),AuthController.getUser)
routerUsuario.get('/failLogin', AuthController.getFailLogin)
routerUsuario.post('/failLogin', AuthController.getFailLogin)

//routerUsuario.get('/signup',AuthController.getSignup)
routerUsuario.post('/signup',passport.authenticate('signup',{failureRedirect:'/api/user/failSignup'}),AuthController.getUser)
routerUsuario.get('/failSignup', AuthController.getFailSignup)
routerUsuario.post('/failSignup', AuthController.getFailSignup)

routerUsuario.get('/logout', AuthMiddleware.checkAuthentication, AuthController.logout)

//TODOS ESTOS CON EL MIDDLEWARE QUE CHEQUEA SESIÒN


routerUsuario.get('/productos', AuthMiddleware.checkAuthentication, AuthController.getProducts)
routerUsuario.post('/productos/:id', AuthMiddleware.checkAuthentication, AuthController.postAProduct)
routerUsuario.post('/productos', AuthMiddleware.checkAuthentication, AuthController.postAProduct)
routerUsuario.delete('/productos/:id', AuthMiddleware.checkAuthentication, AuthController.deleteAProduct)
routerUsuario.delete('/productos', AuthMiddleware.checkAuthentication, AuthController.deleteProducts)
routerUsuario.get('/compras', AuthMiddleware.checkAuthentication, AuthController.getPurchases)
routerUsuario.post('/compras', AuthMiddleware.checkAuthentication, AuthController.postPurchase)


export { routerUsuario };