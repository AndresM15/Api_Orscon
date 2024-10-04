import express from 'express';

import { getUserById, createUser, verifyUser } from '../controllers/user.controller.js';

const router = express.Router()

router.get('/:id_user', getUserById)
router.post('/', verifyUser)
router.post('/create', createUser)

export default router
