var $ = require('jquery');
require('mapbox.js');
require('leaflet.markercluster');

var map = L.mapbox.map('map', 'examples.map-9ijuk24y').setView([37.8102589045, -122.265385309], 12)
  , featureLayer;

function buildPopup(props) {
  return '<h1>' + props.Address + '</h1>' +
    'Category: ' + props.SpecUse + '<br/>' +
    'Acres: ' + props.Acre + '<br/>' +
    'Square Ft: ' + props["SqFt\r"] + '<br/>' +
    'FID Parcel: ' + props.FID_PARCEL;
}

// extend MarkerClusterGroup for filtering in clusters
L.MarkerClusterGroup.include({
  fromGeoJSON: function (geojson) {
    this._geojson = geojson;
    this.filter();
  },

  filter: function (f) {
    f = f || function (m) { return true; }
    var markers = Array();
    for (var i = 0; i < this._geojson.features.length; i++) {
      var a = this._geojson.features[i];
      if (!f(a)) { continue; }
      var title = a.properties['title'];
      var description = a.properties['description']
      var marker = L.marker(new L.LatLng(a.geometry.coordinates[1], a.geometry.coordinates[0]), {
        icon: L.mapbox.marker.icon({'marker-symbol': a.properties['marker-symbol'], 'marker-color': a.properties['marker-color']}),
        title: title
      });

      marker.bindPopup(buildPopup(a.properties));
      markers.push(marker);
    }
    this.clearLayers();
    this.addLayers(markers);
  }
});

var cluster = new L.MarkerClusterGroup();

$.getJSON('http://localhost:8000/', function(data) {
  var geojson = {
    type: 'FeatureCollection',
    features: data
  };

  map.addLayer(cluster);
  cluster.fromGeoJSON(geojson);
});

$('#controls').click("input", function (e) {
  var child_categories = $(e.currentTarget).children(":checked").map(function (idx, c){
    return $(c).val();
  }).toArray();

  cluster.filter(function(f) {
    return child_categories.indexOf(f.properties['SpecUse']) >= 0;
  });
});
