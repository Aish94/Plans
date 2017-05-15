//Require and use express and body parser
const express = require('express');
const routes = require('./controllers/userController');
const bodyParser = require('body-parser');
const session = require('express-session');
//var neo4j = require('neo4j');
//var db = new neo4j.GraphDatabase('http://neo4j:neo4jpwd@localhost:7474');

const app = express();
//const urlencodedParser = bodyParser.urlencoded({ extended:false });
//middlewares
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); //TODO: is json required?
app.use(session({resave: true, saveUninitialized: true, secret : "A sweet secret"}));
app.use(routes);

//Listen on port provided or 3000
app.listen(process.env.port || 3000);
console.log("Listening on port 3000 localhost...");
