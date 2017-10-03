
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
      Webcam.snap(function(data_uri) {
        $('#base64image').attr("src", data_uri);
        SaveSnap();
      });
  }, 3000);
}

function SaveSnap() {
  var file = document.getElementById("base64image").src.substring(23).replace(' ', '+');
  var img = Base64Binary.decodeArrayBuffer(file);
  var ajax = new XMLHttpRequest();
  ajax.addEventListener("load", function(event) {
    uploadcomplete(event);
  }, false);
  ajax.open("POST", "https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize?", "image/jpg");
  ajax.setRequestHeader("Content-Type", "application/octet-stream");
  //ajax.setRequestHeader("Accept-Encoding","gzip, deflate");
  ajax.setRequestHeader("Accept", "text/html,application/xhtml+xml,application/xml");
  ajax.setRequestHeader("Ocp-Apim-Subscription-Key", "a56af77ea8264c04bfa6d55cae572d61");
  ajax.send(img);
}

function uploadcomplete(event) {
  document.getElementById("loading").innerHTML = "Compleated";
  var xmlDoc = event.target.responseXML;
  var list = xmlDoc.getElementsByTagName("scores");
  document.getElementById("anger").innerHTML = list[0].childNodes[0].textContent;
  document.getElementById("contempt").innerHTML = list[0].childNodes[1].textContent;
  document.getElementById("disgust").innerHTML = list[0].childNodes[2].textContent;
  document.getElementById("fear").innerHTML = list[0].childNodes[3].textContent;
  document.getElementById("happiness").innerHTML = list[0].childNodes[4].textContent;
  document.getElementById("neutral").innerHTML = list[0].childNodes[5].textContent;
  document.getElementById("sadness").innerHTML = list[0].childNodes[6].textContent;
  document.getElementById("surprise").innerHTML = list[0].childNodes[7].textContent;
}
//window.onload = ShowCam;
