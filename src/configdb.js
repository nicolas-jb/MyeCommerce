import mongoose from "mongoose";
import dotenv from "dotenv";
import emoji from "node-emoji";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, './.env') });

mongoose.connect(
  process.env.MONGOURI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log(emoji.get("evergreen_tree"), " Conectado a MongoDB!");
    }
  }
);

export default mongoose;
