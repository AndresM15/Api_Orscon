import express from "express";

import { saveImage } from "../controllers/files.controller.js";

const router = express.Router()

router.post('/', saveImage)

export default router;
