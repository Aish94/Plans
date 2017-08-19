var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://neo4j:neo4jpwd@localhost:7474');

function Event(){
}

Event.prototype.addEvent = function(event,owner,result_cb){
  //Add event Node
  event_id = null;
  db.cypher({
      query: 'CREATE (e:Event {Name: {eventName}, dp: {eventImg}, Venue: {eventVenue}, Address:{eventAddress}, Latitude: {eventLatitude}, Longitude: {eventLongitude}, About: {eventDesc}}) '
              + 'WITH e'
              + 'CALL spatial.addNode("event_index",n) YIELD node'
              + 'RETURN node',
      params: {
        eventName: event.name,
        eventVenue: event.venue,
        eventAddress: event.address,
        eventLatitude: parseFloat(event.latitude),
        eventLongitude: parseFloat(event.longitude),
        eventDesc: event.about,
        eventImg: 'default.jpg'
              },
            }, function (err, results) {
      if (err)
        result_cb(new Error(err));
      else if(results.length == 0)
        result_cb("Error in adding event to database");
      else{
        //result_cb(null, results);
        event_id = results[0]["e"]["_id"];
        console.log('Event ID: ' + event_id);
        //result_cb(null, results);
      

      //Create Owner Relationship between user and event
      db.cypher({
            query: 'MATCH (a:User),(b:Event)'
                    +' WHERE ID(a)={a_id} AND ID(b) = {b_id}'
                    + ' CREATE (a)-[r:Owner]->(b)'
                    + ' RETURN r;',
            params: {
                     a_id: owner,
                     b_id: event_id,
                  },
                }, function (err, results) {
                  if (err)
                  {
                    console.log("Error: " + err);
                    result_cb(new Error(err));
                  }
                  else if(results.length == 0)
                    result_cb("Error in adding event to database");
                  else {
                    console.log("Success - from model");
                    result_cb(null, results);
                  }
      });
    }
  });
}

Event.prototype.getEvent = function(event_id,result_cb){
  db.cypher({
      query: 'MATCH (e) Where ID(e)={id} Return e',
      params: {
        id: event_id,
              },
            }, function (err, results) {
      if (err)
        result_cb(new Error(err));
      else{
        console.log(results);
        var first_result = results[0];
        if(first_result)
        {
          result = first_result['e']['properties'];
          result.ID = first_result['e']['_id'];
        }
        console.log(result)
        result_cb(null,result);
      }
  });
}

Event.prototype.getEventOwner = function(event_id){
  console.log('In get event owner');
  return new Promise(function(resolve, reject){
    db.cypher(
      {
        query: 'MATCH (u:User)-[r:Owner]->(e:Event) WHERE ID(e)={id} RETURN u',
        params: {
        id: event_id,
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
          {
            owner_id = result['u']['_id'];
            owner_firstName = result['u']['properties']['firstName'];
            owner_lastName = result['u']['properties']['lastName'];
            owner_data = {'id' : owner_id, 'firstName' : owner_firstName, 'lastName' : owner_lastName};
            console.log(owner_data);
            return resolve(owner_data);
          }
          return reject('No such event');
        }
      }
    );
  });    
}

Event.prototype.getFriendsEvents = function(user_id){
  console.log('In get friends events');
  return new Promise(function(resolve, reject){
    db.cypher(
      {
        query: 'Match(u:User)-[r:Friend]-(f:User)-[r2]->(e:Event) WHERE ID(u)={id} RETURN e,TYPE(r2)',
        params: {
        id: user_id,
              },
      }, 
      function (err, results) 
      {
        if (err)
        {
          console.log('Error: ' + err);
          return reject(err);
        }
        else {
          console.log('No error');
          events = []
          results.forEach(function(event){

            event_name = event["e"]["properties"]["Name"]
            event_id = event["e"]["_id"]
            friend_status = event["TYPE(r2)"]
            data = {'id' : event_id, 'name' : event_name, 'status' : friend_status};
            events.push(data);

          });
          console.log(events);
          return resolve(events);
        }
      }
    );
  });    
}

Event.prototype.getEventDP = function(event_id){
console.log('In get event DP');
  return new Promise(function(resolve, reject){
    db.cypher(
      {
        query: 'MATCH (e:Event) WHERE ID(e)={id} RETURN e',
        params: {
        id: event_id,
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
          {
            event_dp = result['e']['properties']['dp'];
            event_data = {'image_file_name' : event_dp};
            return resolve(event_data);
            console.log(event_data);
          }
          return reject('No such event');
        }
      }
    );
  });    
}

Event.prototype.getNearEvents = function(lat, lon){
  console.log('In get near events');
  console.log('Controller lat : ' + lat);
  console.log('Controller lon : ' + lon);
  return new Promise(function(resolve, reject){
    db.cypher(
      {
        query: 'CALL spatial.withinDistance("event_index",{lon : {location_lon}, lat : {location_lat}}, 50.0);',
        params: {
        location_lon: lon,
        location_lat: lat,
              },
      }, 
      function (err, results) 
      {
        if (err)
        {
          console.log('In error');
          return reject(err);
        }
        else {
          if(results.length == 0)
            return reject('No events nearby');

          console.log(results);
          console.log("Next line");
          events = []
          results.forEach(function(result){
              console.log(result);
              event_id = result['node']._id;
              event_name = result['node'].properties.Name;
              event_distance = result['distance'];
              event_data = {'id' : event_id, 'name' : event_name, 'distance' : event_distance};
              events.push(event_data);
          });
          console.log(events);
          return resolve(events);
          
        }
      }
    );
  });    
}

Event.prototype.uploadDP = function(event_id,file_path,result_cb){
  db.cypher({
      query: 'MATCH (e) Where ID(e)={id} SET e.dp = {dp} RETURN e',
      params: {
          id: event_id,
          dp: file_path,
              },
            }, function (err, results) {
      if (err)
        result_cb(new Error(err));
      else{
        result_cb(null, "Success");
      }
  });
}

Event.prototype.removeDP = function(event_id,result_cb){
  db.cypher({
      query: 'MATCH (e) Where ID(e)={id} SET e.dp = default RETURN e',
      params: {
          id: event_id,
              },
            }, function (err, results) {
      if (err)
        result_cb(new Error(err));
      else{
        result_cb(null, "Success");
      }
  });
}

//Query Database search users through Regex pattern matching
Event.prototype.searchEvent = function(search_string){
  return new Promise(function(resolve, reject){
    db.cypher({
      query: 'Match (e:Event) '
            +'where e.Name =~ \'(?i).*' + search_string + '.*\' '
            + 'return e;',
      params: {
              },
      }, function (err, results) {
        if (err){
          return reject(err);
        } 
        else {
          var Events = [];
          for(var i in results){  //Retrieve Users ID, First name and Last Name. TODO: Add DP
            var event = {id: results[i].e._id, name: results[i].e.properties.Name};
            Events.push(event);
          }
          return resolve(Events);
        }
      }
    );
  });
}

module.exports = Event;
