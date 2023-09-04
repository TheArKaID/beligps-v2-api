var express = require('express');
var router = express.Router();

/* GET index page. */
router.get('/', function(req, res, next) {
  return req.is('application/json')
    ? res.json({
      'status': 200,
      'message': 'Welcome to Track Replay API'
    })
    : res.render('index', { title: 'Express' })
});

module.exports = router;
