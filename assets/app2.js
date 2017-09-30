
// Call to Google Place API
//-----------------------------------------------------------------------------------------------------------------------------
//
var url = "https://maps.googleapis.com/maps/api/place/textsearch/json";
var api = "AIzaSyDDGNN9FZN-yWZway_-vTNSspIcaizUjyc";
var q = 'chinese';
url += '?' + $.param({
  'key': api,
  'query': q + '+Restaurant',
});


$.ajax({
  url: url,
  method: 'GET'
  //dataType: "jsonp"
}).done(function(result) {
  console.log(result);
});
