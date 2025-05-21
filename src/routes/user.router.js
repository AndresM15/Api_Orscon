import express from 'express';

import {
  getUserById, createUser, verifyUser, updateUser, getUserProfile,
  recoverPassword, updateUserByAdmin, deleteUser, getAllUsers,
  resetPassword, sendCoupon
} from '../controllers/user.controller.js';

import { authenticateToken } from '../middlewares/authenticateToken.js';
import { authorizeAdmin } from '../middlewares/authorizeAdmin.js';

const router = express.Router();


router.post('/', verifyUser);
router.post('/create', createUser);
router.post('/recover', recoverPassword);
router.post('/reset-password', resetPassword);
router.post('/send-coupon', sendCoupon);


router.post('/update', updateUser);
router.get('/profile', authenticateToken, getUserProfile);
router.get('/all', authenticateToken, authorizeAdmin, getAllUsers);
router.get('/:id_user', getUserById);



router.put('/update', authenticateToken, authorizeAdmin, updateUserByAdmin);
router.delete('/delete/:id_user', authenticateToken, authorizeAdmin, deleteUser);


export default router;
