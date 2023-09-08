import { Router } from "express"
import controllers from '../controllers/AuthController.js'

const router = Router()

router.post('/login', controllers.login)
router.post('/register', controllers.register)

export default router
