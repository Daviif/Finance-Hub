import { Router } from 'express'
import { createUserController, loginController, getUsers } from '../controllers/users.controller.js'

const router = Router()

// Rota de Cadastro
router.post('/register', createUserController)

// Rota de Login
router.post('/login', loginController)

// Rota de Listagem (para testes)
router.get('/', getUsers)

export default router