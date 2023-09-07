import { expressjwt } from 'express-jwt'
import config from '../config/app.js'

const authenticate = {}

const conf = config

authenticate.check = expressjwt({ secret: conf.secret.key, algorithms: [conf.secret.algorithm] })

export default authenticate
