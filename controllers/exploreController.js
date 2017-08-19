const express = require('express');
const router = express.Router();
const Event = require('../models/event');
var authChecker = require('./authChecker');

var event = new Event();
router.use(authChecker.auth);

router.get('/',function(req,res){
  res.render('explore');
});

router.post('/',function(req,res){
	var lat = parseFloat(req.fields.lat);
	var lon = parseFloat(req.fields.lon);
	var eventDataPromise = Promise.all([ event.getNearEvents(lat, lon)
										, event.getFriendsEvents(req.session.user)
                                    ]);
	eventDataPromise.then(function(data){
		res.send(data);
	},function(err){
		res.send(err);
	});
  //res.render('explore');
});

module.exports = router;