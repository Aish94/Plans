//Require packages
const express = require('express');
const User = require('../models/user');
const ejs = require('ejs');

//Set up router and model object
const router = express.Router();
var user = new User();

//No Auth Checker required for these routes

//Routes

//Index Page
router.get('/',function(req,res){

  if(req.session.user)
    res.redirect('/profile'); //If the user is already logged in redirect to profile
  else
    res.render('index.ejs');  //Redirect to Login/Register page
});

//User Login
router.post('/login',function(req,res){

  user.getUser(req.fields.username,req.fields.pwd, function(err, result){
      
    if(err){
      console.log("Error in retreiving data from the database: " + err);
      res.send("Error in retreiving data from the database"); //TODO: redirect to main page with error
    }
    else {
      if(result){
        req.session.user = result; //Set session variable to User ID. TODO: Should User ID be Node ID?
        res.redirect('/profile');
      }
      else{
        res.send("Fail!"); //TODO: redirect to main page with error
      }
    }

  });
});

//User Registration
router.post('/register',function(req,res){
  
  user.addUser(req.fields,function(err, result){

    if(err){
      console.log("Error in inserting in database." + err);
      res.send("Error in inserting in database.");  //TODO: redirect to main page with error
    }
    else{
      console.log("New user successfully added");
      req.session.user = result;
      res.redirect('/profile');
    }

  });
});

module.exports = router;
