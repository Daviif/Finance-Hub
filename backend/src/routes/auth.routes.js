import { Router } from 'express'
import { 
  forgotPasswordController, 
  resetPasswordController,
  validateTokenController,
  revokeTokenController
} from '../controllers/auth.controller.js'

const router = Router()


router.post('/forgot-password', forgotPasswordController)


router.post('/reset-password', resetPasswordController)


router.post('/validate-token', validateTokenController)


router.post('/revoke-token', revokeTokenController)

export default router
