import { Router } from "express"
import models from '../models/index.js'
import authenticate from '../middlewares/authenticate.js'

const router = Router()

/* GET users listing. */
router.get('/', async function(req, res, next) {
  var users = await models.User.findAll()

  res.json({
    'status': 200,
    'message': 'Success',
    'response': users
  })
})

export default router
