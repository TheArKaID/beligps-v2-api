import { Router } from "express"
import authenticate from '../middlewares/authenticate.js'
import controllers from "../controllers/PairingController.js"

const router = Router()

/* GET pairs listing. */
router.post('/pair', authenticate.check, controllers.pair)
router.post('/unpair', authenticate.check, controllers.unPair)
router.post('/unpair/device', authenticate.check, controllers.unPairDevice)
router.post('/unpair/vehicle', authenticate.check, controllers.unPairVehicle)

export default router
