var express = require('express')
  , router  = express.Router()

router.get('/', function(req, res) {
  res.render('index', {
    facebookAppId: process.env.FACEBOOK_APP_ID || 1452111128392846
  })
})

module.exports = router
