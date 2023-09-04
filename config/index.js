'use strict'

require('dotenv').config()
const fs = require('fs')
const path = require('path')
const basename = path.basename(__filename)
const env = process.env.NODE_ENV || 'development'

const config = {}

fs
.readdirSync(__dirname)
.filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
})
.forEach(file => {
    const conf = require(path.join(__dirname, file))
    config[file.slice(0,-3)] = conf[env] ?? conf
})

module.exports = config