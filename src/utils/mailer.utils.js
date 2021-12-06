import { createTransport } from "nodemailer";
import dotenv from "dotenv";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import log4js from "./logger.utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const loggerConsole = log4js.getLogger();
const loggerError = log4js.getLogger("errorFile");

const transporter = createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: process.env.MAIL_ADMIN,
    pass: process.env.PASS_ADMIN,
  },
});

export async function envioMail(destinatario, asunto, cuerpo) {
  const mailOptions = {
    from: process.env.MAIL_ADMIN,
    to: destinatario,
    subject: asunto,
    html: cuerpo,
  };
  try {
    await transporter.sendMail(mailOptions);
    loggerConsole.info(
      `Se envío un mail al administrador - Asunto: ${asunto} `
    );
  } catch (error) {
    loggerConsole.error(
      "Error al enviar mail al administrador - Asunto: ${asunto}"
    );
    loggerError.error(
      "Error al enviar mail al administrador - Asunto: ${asunto}"
    );
  }
}

export function armarCuerpoMailRegistro(user) {
  const body = `    <style>
                    body {font-family: Georgia, serif;}
                    </style>    
                    <h1> Nuevo Registro en MyEcommerce</h1>
                    <ul>
                    <li type="circle">Id: ${user._id}</li>
                    <li type="circle">Timestamp: ${user.timestamp}</li>
                    <li type="circle">Mail / Username: ${user.username}</li>
                    <li type="circle">Nombre: ${user.nombre}</li>
                    <li type="circle">Dirección: ${user.direccion}</li>
                    <li type="circle">Edad: ${user.edad}</li>
                    <li type="circle">Teléfono: ${user.phone}</li>
                    <li type="circle">Avatar: ${user.avatar}</li>                  
                    </ul>`;
  return body;
}

export function armarCuerpoMailCompra(compra) {
  let productos = "";
  compra.forEach((p) => {
    productos += armarItemProducto(p);
  });
  const body = `  <style>
                    body {font-family: Georgia, serif;}
                    </style>    
                    <h1> Nueva Compra Realizada!</h1>
                    <ul>
                    ${productos}                  
                    </ul>`;
  return body;
}

function armarItemProducto(producto) {
  const body = `    <ul>
                    <li type="circle">Id: ${producto._id}</li>
                    <li type="circle">Timestamp: ${producto.timestamp}</li>
                    <li type="circle">Nombre: ${producto.nombre}</li>
                    <li type="circle">Descripción: ${producto.descripcion}</li>
                    <li type="circle">Código: ${producto.codigo}</li>
                    <li type="circle" <img src=${producto.foto}/>Foto:</li>
                    <li type="circle">Precio: ${producto.precio}</li>                  
                    </ul>
                    <br>`;
  return body;
}
