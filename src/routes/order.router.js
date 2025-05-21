import express from 'express';
import { createOrder } from '../controllers/order.controller.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';

const router = express.Router();

router.post('/', authenticateToken, createOrder);

export default router; 