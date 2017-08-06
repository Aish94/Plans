const express = require('express');
const router = express.Router();
var authChecker = require('./authChecker');

router.use(authChecker.auth);

router.get('/',function(req,res){
  res.render('explore');
});

module.exports = router;