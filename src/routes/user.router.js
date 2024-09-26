import express from 'express';

import { getUserById, createUser } from '../controllers/user.controller.js';

const router = express.Router()

router.get('/:id_user', getUserById)
router.post('/', createUser)

export default router
