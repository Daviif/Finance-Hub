import { Router } from 'express'
import { 
  forgotPasswordController, 
  resetPasswordController,
  validateTokenController,
  revokeTokenController
} from '../controllers/auth.controller.js'

const router = Router()

// Rota para solicitar reset de senha
router.post('/forgot-password', forgotPasswordController)

// Rota para resetar a senha com o token
router.post('/reset-password', resetPasswordController)

// Rota para validar token (útil para o frontend verificar antes de submeter)
router.post('/validate-token', validateTokenController)

// Rota para revogar/invalidar um token
router.post('/revoke-token', revokeTokenController)

export default router
