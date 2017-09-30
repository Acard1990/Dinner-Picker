
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
//Geo-location
//-----------------------------------------------------------------------------------------------------------------------------
//
var getPosition = function (options) {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
};

getPosition()
  .then((position) => {
    console.log(position);
    db.ref().push({
      lat: position.coords.latitude,
      lon: position.coords.longitude
    });
  })
  .catch((err) => {
    console.error(err.message);
  });



//Retrieve and store checked values
//-----------------------------------------------------------------------------------------------------------------------------
//
var genres = [];

$('input[type="submit"]').on('click', function(event) {
  event.preventDefault();

  $('input:checkbox[type="checkbox"]:checked').each(function(){
    genres.push($(this).val());
  });

  for (var i = 0; i < genres.length; i++) {
    var genreName = genres[i];
    var url = "https://maps.googleapis.com/maps/api/place/textsearch/json";
    var api = "AIzaSyDDGNN9FZN-yWZway_-vTNSspIcaizUjyc";
    var q = genres[i];
    url += '?' + $.param({
      'key': api,
      'query': q + '+Restaurant'
    });


    $.ajax({
      url: url,
      method: 'GET'
    }).done(function(response) {
      $.each(response.results, function(j){
        console.log(response.results[j].name);
        db.ref().child(genreName).push({
          name: response.results[j].name
        });
      });
    });
  }
});
