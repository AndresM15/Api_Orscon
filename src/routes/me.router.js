import express from "express";

import { verifyToken } from "../controllers/verify.controller.js";

const router = express.Router()

router.get('/', verifyToken)

export default router;
