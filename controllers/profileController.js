const express = require('express');
const router = express.Router();
var authChecker = require('./authChecker');

const User = require('../models/user');
var user = new User();

//User must be logged in for these routes
router.use(authChecker.auth);

//Routes
//View your profile
router.get('/',function(req,res){

  var userDataPromise = Promise.all([ user.getUserData(req.session.user) 
                                        ,user.getFriends(req.session.user) 
                                        ,user.getCreatedEvents(req.session.user)
                                        ,user.getAttendingEvents(req.session.user)
                                        ,user.getInvitedEvents(req.session.user)
                                        ,user.getAttendedEvents(req.session.user) 
                                    ]);
  userDataPromise.then(function(data){
    res.render('profile',
      {
        me : true, 
        user : data[0], 
        friends : data[1], 
        created_events : data[2], 
        attending_events : data[3], 
        invited_events : data[4], 
        attended_events : data[5], 
        viewer : null, 
         viewee : null
      }
    );}, function(err){
      console.log(err);
      res.send(err);
    });
});

router.post('/upload',function(req,res){
  file_path = req.files.dp.path;
  file_name = file_path.split('/').pop();
  console.log(file_name);
  user.uploadDP(file_name,function(err,result){
    if(err)
      console.log("Error in updating profile pic data");
    else if(result){

    }
  });
  return res.send('File uploaded!');
});

//View others profile
router.get('/view/:id',function(req,res){

  //Viewing your profile
  if(req.params.id == req.session.user)
    res.redirect('/profile');

  //Get relationship - Friend/Stranger/Request sent/Request recieved
  user.getRelationship(req.session.user, parseInt(req.params.id), function(err,relationshipData){
    if(err)
    {
      console.log("Error retreiving user relationship : " + err);
      res.send("No such person!"); //TODO : Better error response and no such person or server error?
      return;
    }

    if(relationshipData == "Friend")
    {
      var userDataPromise = Promise.all([ user.getUserData(parseInt(req.params.id)) 
                                        ,user.getFriends(parseInt(req.params.id)) 
                                        ,user.getCreatedEvents(parseInt(req.params.id))
                                        ,user.getAttendingEvents(parseInt(req.params.id))
                                        ,user.getInvitedEvents(parseInt(req.params.id))
                                        ,user.getAttendedEvents(parseInt(req.params.id)) ]);

    }
    else
    {
      var userDataPromise = Promise.all([ user.getUserData(parseInt(req.params.id)) 
                                        ,user.getFriends(parseInt(req.params.id))  
                                        ]);

    }
    userDataPromise.then(function(data){
      res.render('profile',
      {
        me : false,
        user : data[0], 
        viewer : req.session.user, 
        viewee : parseInt(req.params.id), 
        relationship : relationshipData, 
        friends : data[1], 
        created_events : data[2], 
        attending_events : data[3], 
        invited_events : data[4], 
        attended_events : data[5]
      });
      }, function(err){
            console.log(err);
            res.send("No such person!");
    });
  });
});

module.exports = router;
