//Initialize map based on event location
function initMap() 
{
  // Specify location coordinates
  var $lat = $('.lat').attr('value')
  var $long = $('.long').attr('value')
  var venue = new google.maps.LatLng($lat, $long);

  //Create map object
  var map = new google.maps.Map(document.getElementById('map'), {
          center: venue,
          scrollwheel: false,
          zoom: 15
  });

  //Create marker on map
  var marker = new google.maps.Marker({
         position: venue,
         map: map
  });
}

//Click the file input when the upload button is clicked
$('#uploadBtn').on('click',function(){
  $('#uploadInput').click();
});

//When File Browser opens
$('#uploadInput').on('change', function(){
  // create a FormData object which will be sent as the data payload in the AJAX request
  var formData = new FormData();

  var file = document.getElementById('uploadInput').files[0];

  // add the file to formData object for the data payload
  //(name, value, filename)
  formData.append('uploads', file, file.name);
  //(name,value)
  formData.append('eventID', $('#eventID').val());

  uploadDP(formData);
});

//On clicking the delete DP button
$('#deleteBtn').on('click',function(){
  var formData = new FormData();
  formData.append('eventID', $('#eventID').val());
  removeDP(formData);
});

//Validate file input
function validateForm() {
  file = document.getElementById('uploadInput').files[0];
  if(!file)
    alert('Choose a file to upload');
  else if(file.size > 800000)
    alert('Choose a file of size lesses than 800KB');
  else
    return true;
  return false; //TODO: Check file size and extension
}

//If AJAX call is successful change the DP
function changeDP(data){
  img_url = '/img/' + data.new_img;
  $('#dp_img').attr("src", img_url);
  console.log('Changed DP');
}

//AJAX call to upload DP
function uploadDP(formData){
  if(validateForm()){
    $.ajax({
            type: "POST",
            url: "/event/upload",
            data: formData,
            // Tell jQuery not to process data or worry about content-type
            contentType: false,
            processData: false,
            success: changeDP,
            error: function ( data ) {
              console.log('Error');
            alert( JSON.stringify(data) );
        },
          });
  }
}

//AJAX call to remove DP
function removeDP(){
  $.ajax({
          type: "POST",
          url: "/event/remove",
          data: formData,
          success: changeDP,
          error: errorStatus,
          dataType: 'json'
        });
}