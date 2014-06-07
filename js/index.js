require('mapbox.js');
require('./parcelClusters');
var $ = require('jquery');

module.exports = function(map){

  var cluster = new L.MarkerClusterGroup();
  map.addLayer(cluster);

  $.getJSON(SERVER_BASE_URL + '/points', function(data) {
    console.log("adding markers", data);
    cluster.addBulk(data.features);
  });

  $('#controls').click("input", function (e) {
    console.log("handling click");
    var child_categories = $(e.currentTarget).children(":checked").map(function (idx, c){
      return $(c).val();
    }).toArray();
    cluster.filterCategory(child_categories);
  });

  return cluster;
}
