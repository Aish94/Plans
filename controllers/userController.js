const express = require('express');
const User = require('../models/user');

const router = express.Router();
var user = new User();

//Routes
//Index Page
router.get('/',function(req,res){
  if(req.session.user)
    res.redirect('/profile');
  else
    res.sendFile(__dirname + '/views/index.html');  //TODO: fix views outside controller
});

//User Login
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

//User Registration
router.post('/register',function(req,res){
    user.addUser(req.body,function(err, result){
      if(err)
      {
        console.log("Error in inserting in database." + err);
        res.send("Error in inserting in database.");
      }
      else{
        console.log("New user successfully added");
        req.session.user = result;
        res.redirect('/profile');
      }
    });
});

//View your profile - page after logging in or registering
router.get('/profile',function(req,res){
  if(req.session.user)
  {
    user.getUserData(req.session.user, function(err,result){
      if(err)
        console.log("Error retreiving user data");
      else
        res.render('profile',{me:true,user:result.properties});
        //res.send("Hi "+  result.properties.firstName +"!");
      });
  }
  else
    res.redirect('/');
});

//View others profile
router.get('/profile/:id',function(req,res){
  if(req.session.user)
  {
    user.getUserData(parseInt(req.params.id), function(err,result){
      if(err)
        console.log("Error retreiving user data");
      else if(result)
      {
        console.log("Request session user: " + req.session.user);
        console.log("Result ID: " + result._id);
        if(req.session.user == result._id)
          res.render('profile',{me:true,user:result.properties});
        else
          res.render('profile',{me:false,user:result.properties});
      }
      else
        res.send("No such person!");
      });
    }
    else
      res.redirect('/');
});

//Search for a user
router.get('/search', function(req,res){
  console.log(req.query.user);
  user.searchUser(req.query.user, function(err,result){
    if(err)
      console.log("Error retreiving user data: "+ err);
    else
    {
        res.render('search',{query:req.query.user,users:result});
        console.log("Successfully found: ");
        console.log(result);
    }
    });
});

//User logout
router.get('/logout',function(req,res){
  req.session.destroy(function(err) {
    // cannot access session here
    res.send("Successfully logged out");
  });
});

module.exports = router;
