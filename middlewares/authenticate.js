import { expressjwt } from 'express-jwt'
import config from '../config/app.js'

const authenticate = {}

authenticate.check = expressjwt({ secret: config.secret.key, algorithms: [config.secret.algorithm] })

export default authenticate
