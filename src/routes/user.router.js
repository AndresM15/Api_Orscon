import express from 'express';

import { getUserById, createUser, verifyUser, updateUser } from '../controllers/user.controller.js';

const router = express.Router()

router.post('/', verifyUser)
router.get('/:id_user', getUserById)
router.post('/create', createUser)
router.post('/update', updateUser)
router.get('/:id_user', getUserById)

export default router
