require('mapbox.js');
require('./parcelClusters');

var $ = require('jquery');

var map = L.mapbox.map('map', 'examples.map-9ijuk24y').setView([37.8102589045, -122.265385309], 12);
var cluster = new L.MarkerClusterGroup();
map.addLayer(cluster);

$.getJSON('http://localhost:8000/', function(data) {
  cluster.addBulk(data);
});

$('#controls').click("input", function (e) {
  var child_categories = $(e.currentTarget).children(":checked").map(function (idx, c){
    return $(c).val();
  }).toArray();
  cluster.filterCategory(child_categories);
});
