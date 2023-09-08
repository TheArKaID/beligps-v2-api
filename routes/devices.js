import { Router } from "express"
import authenticate from '../middlewares/authenticate.js'
import controllers from "../controllers/DeviceController.js"

const router = Router()

/* GET users listing. */
router.get('/', authenticate.check, controllers.index)
router.get('/:imei', authenticate.check, controllers.show)
router.post('/', authenticate.check, controllers.store)
router.put('/:imei', authenticate.check, controllers.update)
router.delete('/:imei', authenticate.check, controllers.destroy)

export default router
