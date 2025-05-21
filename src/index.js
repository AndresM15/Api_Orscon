import "dotenv/config"
import cors from "cors"
import express from "express";
import { validateConnection } from "./libs/db.js";
import userRouter from './routes/user.router.js';
import path from "path";
import { fileURLToPath } from "url";
import { routerApi } from "./routes/index.router.js";
const HOST = process.argv.includes('--host=0.0.0.0') ? '0.0.0.0' : '127.0.0.1';
const app = express();
const port = process.env.PORT || 3000;
app.use(cors()); 
app.use(express.json())
//app.use('/users', userRouter);
const whiteList = [];
const options = {
  // origin: (origin, callback) => {
  //   if (whiteList.includes(origin)) callback(null, true)
  //   else callback(new Error("No permitido"))
  // }
  origin: "*"
}
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(cors(options))

validateConnection()
routerApi(app)
app.use('/api/v1/user', userRouter);
app.listen(port, HOST, () => console.log(`Server is running on port ${port}`));

app.on("error", (err) => {
  console.error("Error en el servidor:", err);
});

app.use(express.static(path.join(__dirname, '../../ORSCON')));