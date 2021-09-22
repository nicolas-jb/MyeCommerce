import emoji from "node-emoji";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const serviceAccount = require('./myecommerce-8f717-firebase-adminsdk-5sbpo-f7628f1dea.json');
const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://myecommerce-8f717.firebase.io",
});

const db = admin.firestore();



export const queryProductos = db.collection("productos");
export const queryCarritos = db.collection("carritos");

console.log(emoji.get('fire'), "Conectado a Firebase!")