import { Router } from "express"
import controllers from '../controllers/AuthController.js'

const router = Router()

router.post('/login', controllers.login)

export default router
