var Mustache = require('mustache');
var $ = require('jquery');
var GoogleMapsLoader = require('google-maps');

module.exports = function(parsedUrl) {
  var pointId = parsedUrl.query.point;
  if (pointId) {
    $.getJSON('http://localhost:8000/point/' + pointId, function(data) {

      var coords = data.geometry.coordinates;
      GoogleMapsLoader.load(function(google) {
        var sv = new google.maps.StreetViewService();
        var pointPos = new google.maps.LatLng(coords[1], coords[0]);
        
        sv.getPanoramaByLocation(pointPos, 50, function (data, status){
          if (status == google.maps.StreetViewStatus.OK) {
            var street_view_options = {
              pov: {
                heading: 165,
                pitch: 0
              },
              zoom: 1
            };

            var street_view = new google.maps.StreetViewPanorama(
              document.getElementById('street-view'),
              street_view_options);
            var street_view_pano_id = data.location.pano;
            street_view.setPano(street_view_pano_id);
            street_view.setVisible(true);
          }
        });

      });

      var template = $('#point-template').html();

      var output = Mustache.render(template, data.properties);
      $('#point').html(output);
    });
  }
}