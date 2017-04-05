const express = require('express');
const User = require('../models/user');

const router = express.Router();
var user = new User();

//Routes
router.get('/',function(req,res){
  if(req.session.user)
    res.redirect('/profile');
  else
    res.sendFile(__dirname + '/views/index.html');  //TODO: fix views outside controller
});

router.post('/login',function(req,res){
    user.getUser(req.body.username,req.body.pwd, function(err, result){
      if(err)
      {
        console.log("Error in retreiving data from the database: " + err);
        res.send("Error in retreiving data from the database");
      }
      else {
        if(result)
        {
          req.session.user = result['u']._id;
          res.redirect('/profile');
        }
        else{
          res.send("Fail!");
        }
      }

    });

});

router.post('/register',function(req,res){
    user.addUser(req.body,function(err, result){
      if(err)
      {
        console.log("Error in inserting in database." + err);
        res.send("Error in inserting in database.");
      }
      else{
        console.log("Successfully added");
        req.session.user = result;
        res.redirect('/profile');
      }
    });
});

router.get('/profile',function(req,res){
  if(req.session.user)
  {
    try{
      user.getUserData(req.session.user, function(result){
        res.send("Hi "+  result.properties.firstName +"!");
      });

    }
    catch(error){
      console.log("Error retreiving user data");
    }
  }
  else
    res.redirect('/');
});

router.get('/logout',function(req,res){
  req.session.destroy(function(err) {
    // cannot access session here
    res.send("Successfully logged out");
  });
});

module.exports = router;
