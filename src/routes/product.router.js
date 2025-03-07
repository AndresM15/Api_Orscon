import express from "express";

import { getAll, getProductById } from "../controllers/products.controller.js";

const router = express.Router()

router.get('/:idProduct', getProductById)
router.get('/', getAll)

export default router;
