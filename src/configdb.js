import mongoose from "mongoose";
import dotenv from "dotenv";
import emoji from "node-emoji";
import log4js from "./utils/logger.utils.js"
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "./.env") });

const loggerConsole = log4js.getLogger();
const loggerError = log4js.getLogger("errorFile");

mongoose.connect(
  process.env.MONGOURI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      loggerError.error(err);
      loggerConsole.error(err);
    } else {
      loggerConsole.info(emoji.get("evergreen_tree"), " Conectado a MongoDB!");
    }
  }
);

export default mongoose;
