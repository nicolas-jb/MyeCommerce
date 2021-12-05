import mongoose from "mongoose";

/* -------------------------------- Productos ------------------------------- */

const ProductosSchema = mongoose.Schema({
  nombre: { type: String, required: true },
  timestamp: { type: Number, required: true },
  descripcion: { type: String, required: true },
  codigo: { type: Number, required: true },
  precio: { type: Number, required: true },
  foto: { type: String, required: true },
  stock: { type: Number, required: true },
});

export const ProductoModel = mongoose.model("productos", ProductosSchema);

/* -------------------------------- Carritos -------------------------------- */

const CarritoSchema = mongoose.Schema({
  timestamp: { type: Number, required: true },
  productos: { type: Array, ref: "productos" },
});

export const CarritoModel = mongoose.model("carritos", CarritoSchema);

/* -------------------------------- Usuarios -------------------------------- */

const UsuariosSchema = new mongoose.Schema({
  timestamp: { type: Number, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  nombre: { type: String, required: true },
  direccion: { type: String, required: true },
  edad: { type: Number, required: true },
  phone: { type: String, required: true },
  avatar: { type: String, required: true },
  compras: { type: Array, ref: "carritos" },
  rol: { type: String, default: "user" },
});

export const UserModel = mongoose.model("usuarios", UsuariosSchema);
