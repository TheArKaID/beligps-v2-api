import { Router } from "express"
import authenticate from '../middlewares/authenticate.js'
import controllers from "../controllers/VehicleController.js"

const router = Router()

/* GET users listing. */
router.get('/', authenticate.check, controllers.index)
router.get('/:id', authenticate.check, controllers.show)
router.post('/', authenticate.check, controllers.store)
router.put('/:id', authenticate.check, controllers.update)
router.delete('/:id', authenticate.check, controllers.destroy)

export default router
