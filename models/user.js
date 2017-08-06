//Require Neo4j Database Package and connect
var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://neo4j:neo4jpwd@localhost:7474');

function User(){
}

//Query the database to check if user exists and retrieve user ID
User.prototype.getUser = function(user_email,user_pwd,result_cb){
  //TODO: Check about hashing password
  db.cypher({
      query: 'Match (u:User{email:{email},pwd:{pwd}}) Return ID(u)',
      params: {
        email: user_email,
        pwd:  user_pwd,
      },
    }, function (err, results) {
      if (err){
        console.log(err);
        result_cb(new Error(err));
      }
      else {
        console.log(JSON.stringify(results));
        var result = results[0]["ID(u)"]//results[0]['u']['_id'];  //Retrieve User ID
        result_cb(null,result);
      }
    }
  );
}

//Query the database to add new user
User.prototype.addUser = function(user,result_cb){
  //TODO: Check about hashing password
  db.cypher({
      query: 'CREATE (u:User {firstName: {firstName}, lastName: {lastName}, email: {email}, pwd: {pwd}}) RETURN u',
      params: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.username,
        pwd:  user.pwd,
      },
    }, function (err, results) {
      if (err)
        result_cb(new Error(err));
      else{
        var result = results[0];
        result_cb(null, result['u']._id);
      }
    }
  );
}

User.prototype.uploadDP = function(user,result_cb){
  db.cypher({
      query: 'MATCH ((u) Where ID(u)={id} SET u.dp = {dp} RETURN u',
      params: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.username,
          pwd:  user.pwd,
              },
            }, function (err, results) {
      if (err)
        result_cb(new Error(err));
      else{
        var result = results[0];
        result_cb(null, result['u']._id);
      }
  });
}

User.prototype.getUserData = function(user_id){
  console.log("User ID in user.js: ", user_id);

  return new Promise(function(resolve, reject){
    db.cypher(
      {
        query: 'Match (u) Where ID(u)={id} Return u',
        params: {
        id: user_id,
              },
      }, 
      function (err, results) 
      {
        if (err)
        {
          return reject(err);
        }
        else {
          var result = results[0];
          if(result)
            result = result['u']['properties'];
          return resolve(result);
        }
      }
    );
  });    
}

User.prototype.getFriends = function(user_id){
  console.log("User ID in user.js: ", user_id);

  return new Promise(function(resolve, reject){
    db.cypher(
      {
        query: 'MATCH (u:User)-[r:Friend]-(f:User) WHERE ID(u)={id} RETURN f',
        params: {
        id: user_id,
              },
      }, 
      function (err, results) 
      {
        if (err)
        {
          return reject(err);
        }
        else {
          friends = [];
          results.forEach(function(element){
            friend_id = element['f']['_id'];
            friend_firstName = element['f']['properties']['firstName'];
            friend_lastName = element['f']['properties']['lastName'];
            friend_data = {'id' : friend_id, 'firstName' : friend_firstName, 'lastName' : friend_lastName};
            friends.push(friend_data); 
            //TODO: Add DP parameter
          });
          return resolve(friends);
        }
      }
    );
  });    
}

//TODO: Similarly create ones for attending, attended and invited events
User.prototype.getCreatedEvents = function(user_id){
  console.log("User ID in user.js: ", user_id);

  return new Promise(function(resolve, reject){
    db.cypher(
      {
        query: 'MATCH (u:User)-[r:Owner]-(e:Event) WHERE ID(u)={id} RETURN e',
        params: {
        id: user_id,
              },
      }, 
      function (err, results) 
      {
        if (err)
        {
          return reject(err);
        }
        else {
          events = [];
          results.forEach(function(element){
            event_id = element['e']['_id'];
            event_name = element['e']['properties']['Name'];
            event_data = {'id' : event_id, 'name' : event_name};
            events.push(event_data); 
            //TODO: Add DP parameter
          });
          return resolve(events);
        }
      }
    );
  });    
}

User.prototype.getInvitedEvents = function(user_id){
  console.log("User ID in user.js: ", user_id);

  return new Promise(function(resolve, reject){
    db.cypher(
      {
        query: 'MATCH (u:User)-[r:Invited]-(e:Event) WHERE ID(u)={id} RETURN e',
        params: {
        id: user_id,
              },
      }, 
      function (err, results) 
      {
        if (err)
        {
          return reject(err);
        }
        else {
          events = [];
          results.forEach(function(element){
            event_id = element['e']['_id'];
            event_name = element['e']['properties']['Name'];
            event_data = {'id' : event_id, 'name' : event_name};
            events.push(event_data); 
            //TODO: Add DP parameter
          });
          return resolve(events);
        }
      }
    );
  });    
}

User.prototype.getAttendingEvents = function(user_id){
  console.log("User ID in user.js: ", user_id);

  return new Promise(function(resolve, reject){
    db.cypher(
      {
        query: 'MATCH (u:User)-[r:Attending]-(e:Event) WHERE ID(u)={id} RETURN e',
        params: {
        id: user_id,
              },
      }, 
      function (err, results) 
      {
        if (err)
        {
          return reject(err);
        }
        else {
          events = [];
          results.forEach(function(element){
            event_id = element['e']['_id'];
            event_name = element['e']['properties']['Name'];
            event_data = {'id' : event_id, 'name' : event_name};
            events.push(event_data); 
            //TODO: Add DP parameter
          });
          return resolve(events);
        }
      }
    );
  });    
}

User.prototype.getAttendedEvents = function(user_id){
  console.log("User ID in user.js: ", user_id);

  return new Promise(function(resolve, reject){
    db.cypher(
      {
        query: 'MATCH (u:User)-[r:Attended]-(e:Event) WHERE ID(u)={id} RETURN e',
        params: {
        id: user_id,
              },
      }, 
      function (err, results) 
      {
        if (err)
        {
          return reject(err);
        }
        else {
          events = [];
          results.forEach(function(element){
            event_id = element['e']['_id'];
            event_name = element['e']['properties']['Name'];
            event_data = {'id' : event_id, 'name' : event_name};
            events.push(event_data); 
            //TODO: Add DP parameter
          });
          return resolve(events);
        }
      }
    );
  });    
}

//Query Database search users through Regex pattern matching
User.prototype.searchUser = function(search_string){
  return new Promise(function(resolve, reject){
    db.cypher({
      query: 'Match (u:User) '
            +'where u.firstName =~ \'(?i).*' + search_string + '.*\' '
            + 'OR u.lastName =~ \'(?i).*' + search_string + '.*\' '
            + 'OR u.email =~ \'(?i).*' + search_string + '.*\''
            + 'return u;',
      params: {
              },
      }, function (err, results) {
        if (err){
          return reject(err);
        } 
        else {
          var Users = [];
          for(var i in results){  //Retrieve Users ID, First name and Last Name. TODO: Add DP
            var user = {id: results[i].u._id,firstName: results[i].u.properties.firstName, lastName: results[i].u.properties.lastName};
            Users.push(user);
          }
          return resolve(Users);
        }
      }
    );
  });
}

//a->b when a sends Friend Request
//b->a when b accepts Friend Request
User.prototype.addFriend = function(userA, userB ,result_cb){
  console.log("Adding Friend - from model.... a_id: " + userA + "b_id: " + userB);
  //$MATCH (a:User)-[r:Friend]->(b:User) WHERE ID(a)=1 AND ID(b) = 2 DELETE r CREATE (a)-[r2:Friend]->(b) RETURN a,b,r,r2
      db.cypher({
        query: 'MATCH (a:User)<-[r:Request]-(b:User)'
                +' WHERE ID(a)={a_id} AND ID(b) = {b_id}'
                + 'DELETE r'
                + ' CREATE (a)-[r2:Friend]->(b)'
                + ' RETURN r,r2;',
        params: {
                 a_id: userA,
                 b_id: userB,
              },
            }, function (err, results) {
              if (err)
              {
                console.log("Error: " + err);
                result_cb(new Error(err));
              }
              else {
                console.log("Success - from model");
                result_cb(null);
              }
  });
}

User.prototype.sendRequest = function(userA, userB ,result_cb){
  console.log("Adding Friend - from model.... a_id: " + userA + "b_id: " + userB);
      db.cypher({
        query: 'MATCH (a:User),(b:User)'
                +' WHERE ID(a)={a_id} AND ID(b) = {b_id}'
                + ' CREATE (a)-[r:Request]->(b)'
                + ' RETURN r;',
        params: {
                 a_id: userA,
                 b_id: userB,
              },
            }, function (err, results) {
              if (err)
              {
                console.log("Error: " + err);
                result_cb(new Error(err));
              }
              else {
                console.log("Success - from model");
                result_cb(null);
              }
  });
}

//TODO: Modify to reflect Friend Request changes
User.prototype.getRelationship = function(userA, userB ,result_cb){
  console.log("User A : " + userA);
  console.log("User B : " + userB);
  db.cypher({
    query: 'MATCH (a)-[r]-(b)'
            +' WHERE ID(a)={a_id} and ID(b)={b_id}'
            +' RETURN type(r), startNode(r)',
    params: {
             a_id: userA,
             b_id: userB,
          },
        }, function (err, results) {
          if (err)
          {
            result_cb(new Error(err));
          }
          else {
            console.log(JSON.stringify(results));
            if(results.length == 0)
              result_cb(null,"Stranger");
            else if(results[0]["type(r)"] == "Friend")
              result_cb(null,"Friend");
            else{
              if(results[0]['startNode(r)']._id == userA)
                result_cb(null,"Sent Request");
              else
                result_cb(null,"Recieved Request");
            }
          }
});
}

module.exports = User;
