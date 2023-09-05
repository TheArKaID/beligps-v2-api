const express = require('express');
const router = express.Router();
const models = require('../models/index')
const { check } = require('../middlewares/authenticate')

/* GET users listing. */
router.get('/', check, async function(req, res, next) {
  
  var users = await models.User.findAll()

  res.send(users);
});

module.exports = router;
