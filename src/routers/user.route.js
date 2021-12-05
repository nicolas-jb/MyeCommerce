import { Router } from "express";
import passport from '../utils/passport.utils.js'
import * as AuthController from "../controllers/user.controller.js";

const routerUsuario = new Router();

//routerUsuario.get('/login',AuthController.getLogin)
routerUsuario.post('/login', passport.authenticate('login',{failureRedirect:'/user/failLogin'}),AuthController.postLogin)
routerUsuario.get('/failLogin', AuthController.getFailLogin)
routerUsuario.post('/failLogin', AuthController.getFailLogin)

//routerUsuario.get('/signup',AuthController.getSignup)
routerUsuario.post('/signup',passport.authenticate('signup',{failureRedirect:'/user/failSignup'}),AuthController.postSignup)
routerUsuario.get('/failSignup', AuthController.getFailSignup)
routerUsuario.post('/failSignup', AuthController.getFailSignup)




export { routerUsuario };