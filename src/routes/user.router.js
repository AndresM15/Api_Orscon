import express from 'express';

import { getUserById, createUser, verifyUser, updateUser, getUserProfile, recoverPassword } from '../controllers/user.controller.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { resetPassword } from '../controllers/user.controller.js';

const router = express.Router()

router.post('/', verifyUser)
router.post('/create', createUser)
router.post('/update', updateUser)

router.get('/profile',authenticateToken, getUserProfile)

router.get('/:id_user', getUserById)

router.post('/recover', recoverPassword);

router.post('/reset-password', resetPassword);

export default router
