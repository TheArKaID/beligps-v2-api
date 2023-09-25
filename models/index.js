'use strict'

import { basename as _basename, join, dirname } from 'path'
import Sequelize, { DataTypes } from 'sequelize'
import config from '../config/config.js'
import configApp from '../config/app.js'
import { fileURLToPath } from 'url';
import os from 'os'
import { readdir } from 'fs/promises'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const basename = _basename(__filename)

const db = {}
const conf = config[configApp.env]

let sequelize = new Sequelize(conf.database, conf.username, conf.password, conf)

await readdir(__dirname)
  .then(async files => {
    let x = files.filter(file => {
      return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
    })

    for (const file of x) {
      const uri = os.platform() === 'win32' ? `file:///${join(__dirname, file)}` : join(__dirname, file)
  
      const model = (await import(uri)).default(sequelize, DataTypes)
  
      db[model.name] = model
    }
  })
  .finally(() => {
    Object.keys(db).forEach(modelName => {
      if (db[modelName].associate) {
        db[modelName].associate(db)
      }
    })
  })

db.sequelize = sequelize
db.Sequelize = Sequelize

export default db
