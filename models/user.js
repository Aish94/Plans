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
      db.cypher({
        query: 'Match (u) Where ID(u)={id} Return u',
        params: {
        id: user_id,
              },
            }, function (err, results) {
      if (err)
        throw err;
      var result = results[0]['u'];
      result_cb(result);
  });
}

module.exports = User;
