// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

/*$(function () {
                $('#datetimepicker').datetimepicker();
            });*/

function updateMap() {

}

function initAutocomplete() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -33.8688, lng: 151.2195},
    zoom: 13,
    mapTypeId: 'roadmap'
  });

  // Create the search box and link it to the UI element.
 var input = document.getElementById('address');
 var searchBox = new google.maps.places.SearchBox(input);
 map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

/*var icon = {
       url: place.icon,
       size: new google.maps.Size(71, 71),
       origin: new google.maps.Point(0, 0),
       anchor: new google.maps.Point(17, 34),
       scaledSize: new google.maps.Size(25, 25)
     };*/

// Create a marker for each place.
     marker = new google.maps.Marker({
     });

 // Listen for the event fired when the user selects a prediction and retrieve
 // more details for that place.
 searchBox.addListener('places_changed', function() {
   var places = searchBox.getPlaces();

   if (places.length == 0) {
     console.log("0 places returned");
     return;
   }

   var place = places[0];
   var Latitude = place.geometry.location.lat();
   var Longitude = place.geometry.location.lng();
   // For each place, get the icon, name and location.
   //var bounds = new google.maps.LatLngBounds();
   //places.forEach(function(place) {
     if (!place.geometry) {
       console.log("Returned place contains no geometry");
       return;
     }
     

     //update map
     /*var map = new google.maps.Map(document.getElementById('map'), {
       center: place.geometry.location,
       scrollwheel: false,
       zoom: 15
     });*/
     map.setCenter(place.geometry.location);
     map.setZoom(15);

     marker.setTitle(place.name);
     marker.setPosition(place.geometry.location);
     marker.setMap(map);

     //Add to Form Data
     document.getElementById("latitude").value = Latitude;
     document.getElementById("longitude").value = Longitude;

     
  });

}
