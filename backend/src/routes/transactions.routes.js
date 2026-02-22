import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js'
import * as transactionsController from '../controllers/transactions.controller.js'

const router = Router()
router.use(authMiddleware)

router.get('/', transactionsController.list)
router.post('/', transactionsController.create)
router.put('/:id', transactionsController.update)
router.delete('/:id', transactionsController.remove)

export default router
