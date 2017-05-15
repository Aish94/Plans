var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://neo4j:neo4jpwd@localhost:7474');

function User(){
}

User.prototype.addUser = function(user,result_cb){
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
  });
}

User.prototype.getUser = function(user_email,user_pwd,result_cb){
  db.cypher({
      query: 'Match (u:User{email:{email},pwd:{pwd}}) Return u',
      params: {
          email: user_email,
          pwd:  user_pwd,
              },
            }, function (err, results) {
      if (err)
      {
        result_cb(new Error(err));
      }
      else {
        var result = results[0];
        result_cb(null,result);
      }
  });
}

User.prototype.getUserData = function(user_id,result_cb){
  console.log("User ID in user.js: ", user_id);
      db.cypher({
        query: 'Match (u) Where ID(u)={id} Return u',
        params: {
        id: user_id,
              },
            }, function (err, results) {
      if (err)
      {
        result_cb(new Error(err));
      }
      else {
        var result = results[0];
        if(result)
          result = result['u'];
        result_cb(null,result);
      }
  });
}

User.prototype.searchUser = function(search_string,result_cb){
      db.cypher({
        query: 'Match (u:User) '
                +'where u.firstName =~ \'(?i).*' + search_string + '.*\' '
                + 'OR u.lastName =~ \'(?i).*' + search_string + '.*\' '
                + 'OR u.email =~ \'(?i).*' + search_string + '.*\''
                + 'return u;',
        params: {
              },
            }, function (err, results) {
              if (err)
              {
                result_cb(new Error(err));
              }
              else {
                var Users = [];
                for(var i in results)
                {
                  var user = {id: results[i].u._id,firstName: results[i].u.properties.firstName, lastName: results[i].u.properties.lastName};
                  Users.push(user);
                }
                result_cb(null,Users);
              }
  });
}

module.exports = User;
