import { Router } from "express"
import models from '../models/index.js'
import authenticate from '../middlewares/authenticate.js'

const router = Router()

/* GET users listing. */
router.get('/', authenticate.check, async function(req, res, next) {
  var users = await models.User.findAll()

  res.send(users)
})

export default router
