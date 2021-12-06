import twilio from "twilio";
import dotenv from "dotenv";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import log4js from "./logger.utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const loggerConsole = log4js.getLogger();
const loggerError = log4js.getLogger("errorFile");

const accountSid = process.env.TWILIO_ID;
const authToken = process.env.TWILIO_TOKEN;
const client = twilio(accountSid, authToken);

const optionsSMS = {
  body: "Hola soy un SMS desde Node.js!",
  from: "+12286664895",
  to: "+5491135989525",
};

const optionsWP = {
  body: "Hola soy un WSP desde Node.js!",
  from: "whatsapp:+14155238886",
  to: "whatsapp:+5491135989525",
};

export async function envioMje(remitente, destinatario, cuerpo) {
  try {
    const option = {
      body: cuerpo,
      from: remitente,
      to: destinatario,
    };
    await client.messages.create(option);
    if (remitente.startsWith("whatsapp")) {
      loggerConsole.info("Se ha enviado un Whatsapp al administrador");
    } else {
      loggerConsole.info("Se ha enviado un SMS al comprador");
    }
  } catch (error) {
    loggerConsole.error(
      "Se ha producido un error al intentar enviar el mensaje"
    );
    loggerError.error("Se ha producido un error al intentar enviar el mensaje");
  }
}
