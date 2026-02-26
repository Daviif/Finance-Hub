import { Router } from 'express'
import { createUserController, loginController, getUsers } from '../controllers/users.controller.js'

const router = Router()


router.post('/register', createUserController)


router.post('/login', loginController)


router.get('/', getUsers)

export default router