const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const uuidv1 = require('uuid/v1'); //hashing based on timestamp
const Event = require('../models/event');
var authChecker = require('./authChecker');

var event = new Event();
router.use(authChecker.auth);

router.get('/view/:id',function(req,res){
  event.getEvent(parseInt(req.params.id), function(err, result){
    if(err)
    {
      console.log("Error in retreiving data from the database: " + err);
      res.send("Error in retreiving data from the database");
    }
    else {
      if(result)
      {
        console.log(result);
        res.render('event',{event:result});
      }
      else{
        res.send("No such event!");
      }
    }
  });
});

router.get('/create', function(req,res){
  res.render('eventForm');
});

//TODO: Redirect to created event page
router.post('/create',function(req,res){
  event.addEvent(req.fields, req.session.user, function(err, result){
    if(err)
    {
      console.log("Error in retreiving data from the database: " + err);
      res.send("Error in retreiving data from the database");
    }
    else {
      if(result)
      {
        res.send(result);
      }
      else{
        res.send("Fail!");
      }
    }
  });
});

function uploadPicture(file_paths){

  //Get File metadata
  temp_file_path = file_paths.old
  temp_file_name = temp_file_path.split('/').pop(); //Get file name
  file_ext = temp_file_name.split('.').pop(); //Get file extension
  img_dir = path.resolve(__dirname, '..','public','img' );
  console.log('Temp file name : ' + temp_file_name);
  console.log('File Extension : ' + file_ext);
  console.log('Image Dir : ' + img_dir);

  //Generate a unique ID
  unique = false;
  while(!unique){
    new_file_name = uuidv1() + '.' + file_ext;
    new_file_path = img_dir + '/' + new_file_name;
    console.log('New file path : ' + new_file_path);
    if(!fs.existsSync(new_file_path))
      unique = true;
  console.log('Unique value: ' + Boolean(unique));
  }

  //Rename and move file
  fs.rename(temp_file_path, new_file_path, function(err) {
    if ( err ) {
    console.log('ERROR in moving file: ' + err);
    return false;
    }
  });

  //Return new file path
  file_paths.new = new_file_name;
  return true;
}

//TODO: fix all indentations, error messages - all the files
//TODO: Delete old DP
router.post('/upload',function(req,res){
  //Check that the current User ID matches the event owner
  //Get old file path and delete it
  console.log('In /uplaod')
  var eventDataPromise = Promise.all([ event.getEventOwner(parseInt(req.fields.eventID)),
                                      event.getEventDP(parseInt(req.fields.eventID))
                                    ]);
  eventDataPromise.then(function(data){
    console.log('In then');
    owner_id = data[0].id
    old_image_name = data[1].image_file_name

    console.log('Owner ID : ' + owner_id);
    console.log('Old Image Name : ' + old_image_name);

    //check if IDs match
    if(owner_id != req.session.user)
      return res.send('Action not allowed');

    //Upload new picture
    file_paths = {old : req.files.uploads.path}; //Get absolute file path - stored in the public/tmp folder
    if(!uploadPicture(file_paths))
      res.send('Couldn\'t upload!');
    event.uploadDP(parseInt(req.fields.eventID), file_paths.new, function(err,result){
      if(err)
      {
        console.log("Error in uploading data to the database: " + err);
        res.status(500).send("Error in uploading image");
      }
      else {
        if(result)
        {
          //Delete old picture
          if(old_image_name != 'default.jpg')
          {
            img_dir = path.resolve(__dirname, '..','public','img' );
            old_image_path = img_dir + '/' + old_image_name;
            fs.unlinkSync(old_image_path);
          }

          //Send result
          res.status(200).send({data : "success", new_img : file_paths.new});
        }
        else{
          res.status(500).send({data: "Failed to upload"});
          //res.send("Failed to upload!");
        }
      }
    });

  }, function(err){
    res.send('No such event');
  }
  );
});

router.post('/remove', function(req,res){
  event.uploadDP(parseInt(req.fields.eventID), 'default.jpg',function(err,result){
      if(err)
      {
        console.log("Error in uploading data to the database: " + err);
        res.status(500).send("Error in removing image");
      }
      else {
        if(result)
        {
          res.status(200).send({data : "success", new_img : 'default.jpg'});
          //res.send('File uploaded!');
        }
        else{
          res.status(500).send({data: "Failed to upload"});
          //res.send("Failed to upload!");
        }
      }
    });
});

module.exports = router;
