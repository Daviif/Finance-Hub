import { Router } from 'express'
import { loginController } from '../controllers/auth.controller.js'

const router = Router()

router.post('/auth', (req, res) => {
  return res.json({ ok: true })
})

export default router
