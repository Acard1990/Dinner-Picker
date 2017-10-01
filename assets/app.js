
// Firebase globals
//-----------------------------------------------------------------------------------------------------------------------------
//
var config = {
  apiKey: "AIzaSyCl0vPiiyIf8kF4A6muwK__AwXRkLupi-U",
  authDomain: "dinner-picker-4be13.firebaseapp.com",
  databaseURL: "https://dinner-picker-4be13.firebaseio.com",
  projectId: "dinner-picker-4be13",
  storageBucket: "",
  messagingSenderId: "767642575660"
};
firebase.initializeApp(config);

var db = firebase.database();
var consRef = db.ref("/connections");
var conInfo = db.ref(".info/connected");

//Geo-location
//-----------------------------------------------------------------------------------------------------------------------------
//
var lat;
var lon;
var getPosition = function (options) {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
};

getPosition()
  .then((position) => {
    console.log(position);
    lat = position.coords.latitude;
    lon = position.coords.longitude;
  })
  .catch((err) => {
    console.error(err.message);
  });

//Retrieve and store checked values
//-----------------------------------------------------------------------------------------------------------------------------
//
var genres = [];
var restaurants = [];
$('input[type="submit"]').on('click', function(event) {
  event.preventDefault();

  $('input:checkbox[type="checkbox"]:checked').each(function(){
    genres.push($(this).val());
  });

  for (var i = 0; i < genres.length; i++) {
    var url = "https://maps.googleapis.com/maps/api/place/textsearch/json";
    var api = "AIzaSyCrSZtxM-JFlEyqajAam7VuztNLoXi3DPc";
    var q = genres[i];
    url += '?' + $.param({
      'key': api,
      'query': q + '+Restaurant',
      'location': lat + ',' + lon
    });

    $.ajax({
      url: url,
      method: 'GET'
    }).done(function(response) {
      for (var j = 0; j < 3; j++) {
        restaurants.push(response.results[j].name);
      }
    });
  }
  $('#form').empty();
  runCamera();
});

//
//-----------------------------------------------------------------------------------------------------------------------------
//

function runCamera() {
  Webcam.attach('#my_camera');
  setTimeout(function() {
    console.log("Sup, bro");
      Webcam.snap(function(data_uri) {
        $('#my_result').html('<img src="' + data_uri + '">');
      });
  }, 3000);
}
