const { expressjwt } = require("express-jwt");
const config = require('../config/index')

const authenticate = {}

authenticate.check = expressjwt({ secret: config.app.secret.key, algorithms: [config.app.secret.algorithm] })

module.exports = authenticate
