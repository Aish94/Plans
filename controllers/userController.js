const express = require('express');
const User = require('../models/user');
const Event = require('../models/event');
var authChecker = require('./authChecker');

const router = express.Router();
var user = new User();
var event = new Event();

//User must be logged in for these routes
router.use(authChecker.auth);

//Routes
//Search for a user
router.get('/search', function(req,res){
  console.log(req.query.user);
  var searchDataPromise = Promise.all([ user.searchUser(req.query.user),
                                      event.searchEvent(req.query.user)
                                    ]);

  searchDataPromise.then(function(data){
      console.log("Successfully found: ");
      console.log(data);
      res.render('search',{query : req.query.user, users : data[0], events : data[1]});
    }, function(err){
      console.log("Error retreiving user data: "+ err); //TODO : Better way to display error to user 
      res.send("Error retreiving user data");
    }
  );
});

router.post('/addFriend', function(req,res){
  if(req.fields.user_a != req.session.user)
    res.send('Action not allowed');

  console.log(JSON.stringify(req.fields))
  console.log("Adding Friend - from controller.... a_id: " + req.fields.user_a + "b_id: " + req.fields.user_b);
  user.addFriend(parseInt(req.fields.user_a),parseInt(req.fields.user_b),function(err,result){
    if(err)
    {
      console.log("Error in adding friend: "+ err);
      res.status(500).send({error : err});
    }
      else {
        console.log("Successfully added friend!");
        res.status(200).send({data: "success"});
      }
  });
});

router.post('/sendRequest', function(req,res){
  console.log('In /sendRequest controller');
    if(parseInt(req.fields.user_a) != req.session.user)
    {  
      res.send('Action not allowed');
      return;
    }

  console.log(JSON.stringify(req.fields))
  console.log("Adding Friend - from controller.... a_id: " + req.fields.user_a + "b_id: " + req.fields.user_b);
  user.sendRequest(parseInt(req.fields.user_a),parseInt(req.fields.user_b),function(err,result){
    if(err)
    {
      console.log("Error in adding friend: "+ err);
      res.status(500).send({error : err});
    }
      else {
        console.log("Successfully added friend!");
        res.status(200).send({data: "success"});
      }
  });
});

//User logout
router.get('/logout',function(req,res){

  req.session.destroy(function(err) {
    res.redirect('/');
  });

});

module.exports = router;
