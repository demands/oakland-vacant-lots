require('mapbox.js');
require('./parcelClusters');
var $ = require('jquery');

module.exports = function(){
  var map = L.mapbox.map('map', MAPBOX_MAP_ID).setView([37.8102589045, -122.265385309], 12);
  var cluster = new L.MarkerClusterGroup();
  map.addLayer(cluster);

  $.getJSON(SERVER_BASE_URL + '/points', function(data) {
    cluster.addBulk(data.features);
  });

  $('#controls').click("input", function (e) {
    var child_categories = $(e.currentTarget).children(":checked").map(function (idx, c){
      return $(c).val();
    }).toArray();
    cluster.filterCategory(child_categories);
  });
}