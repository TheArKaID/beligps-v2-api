import { Router } from "express"
import authenticate from '../middlewares/authenticate.js'
import controllers from "../controllers/DeviceController.js"

const router = Router()

/* GET users listing. */
router.get('/', authenticate.check, controllers.index)

export default router
