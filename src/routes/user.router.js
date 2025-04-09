import express from 'express';

import { getUserById, createUser, verifyUser, updateUser, getUserProfile  } from '../controllers/user.controller.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
const router = express.Router()

router.post('/', verifyUser)
router.post('/create', createUser)
router.post('/update', updateUser)

router.get('/profile',authenticateToken, getUserProfile)

router.get('/:id_user', getUserById)



export default router
