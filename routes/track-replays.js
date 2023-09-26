import { Router } from "express"
import authenticate from '../middlewares/authenticate.js'
import controllers from "../controllers/TrackReplayController.js"

const router = Router()

router.get('/', authenticate.check, controllers.getTrackReplay)

export default router
