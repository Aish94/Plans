//Require Node packages
const express = require('express');
const session = require('express-session');
const formidable = require('express-formidable');
const path = require('path');

//Require Controllers
const userRoutes = require('./controllers/userController');
const eventRoutes = require('./controllers/eventController');
const profileRoutes = require('./controllers/profileController');
const authRoutes = require('./controllers/authController');
const exploreRoutes = require('./controllers/exploreController');

//Create Express app
const app = express();

//Set Middlewares
app.set('view engine','ejs');	//Templating Engine: EJS
app.set('views', path.join( __dirname , 'views'));	//EJS views Folder
app.use(session({resave: true, saveUninitialized: true, secret : "A sweet secret"})); //Set up sessions
app.use(express.static(path.join(__dirname,'public')));	//Set up static folder(js, css, img)
app.use(formidable({	//File Handling
  encoding: 'utf-8',
  uploadDir: __dirname + '/public/tmp',	//Temporary upload folder for files
  multiples: true, // req.files to be arrays of files
  keepExtensions : true
}));

//Routes
app.use('/',authRoutes);
app.use('/event',eventRoutes);
app.use('/profile',profileRoutes);
app.use('/user',userRoutes);
app.use('/explore',exploreRoutes);

//Listen on port provided or 3000
app.listen(process.env.port || 3000);
console.log("Listening on port 3000 localhost...");

//TODO: Create an index for username and query accordingly
//TODO: When searching for people and events return results in parts
//TODO: Similarly return Friends, Attendees, etc. in parts
