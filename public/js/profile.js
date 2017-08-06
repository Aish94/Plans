var page = '#Profile';

function changeStatus(message){
	$('#relation').html("<p> " + message + " </p>");
}
     
function errorStatus(request, status, error){
	alert("Server Error!");
}
      
function addFriend(viewer, viewee){
	var friends = {"user_a" : viewer, "user_b" : viewee};
    $.ajax({
          type: "POST",
          url: "/user/addFriend",
          data: friends,
          success: changeStatus('Friends'),
          error: errorStatus,
          dataType: 'json'
        });
}

function sendRequest(viewer, viewee){
        var friends = {"user_a" : viewer, "user_b" : viewee};
        $.ajax({
          type: "POST",
          url: "/user/sendRequest",
          data: friends,
          success: changeStatus('Friend Request Sent'),
          error: errorStatus,
          dataType: 'json'
        });
}