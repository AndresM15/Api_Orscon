import "dotenv/config"
import cors from "cors"
import express from "express";
import { validateConnection } from "./libs/db.js";

import { routerApi } from "./routes/index.router.js";
const HOST = process.argv.includes('--host=0.0.0.0') ? '0.0.0.0' : '127.0.0.1';
const app = express();
const port = process.env.PORT;

app.use(express.json())

const whiteList = [];
const options = {
  // origin: (origin, callback) => {
  //   if (whiteList.includes(origin)) callback(null, true)
  //   else callback(new Error("No permitido"))
  // }
  origin: "*"
}

app.use(cors(options))

validateConnection()
routerApi(app)

app.listen(port, HOST, () => console.log(`Server is running on port ${port}`));
