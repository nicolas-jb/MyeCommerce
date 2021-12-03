import mongoose from "mongoose";

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

const CarritoSchema = mongoose.Schema({
    timestamp: { type: Number, required: true },
    productos: { type: Array, ref: 'productos'},
  });
  
export const CarritoModel = mongoose.model("carritos", CarritoSchema);


