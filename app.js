var url = require('url');
require('mapbox.js');

var parsedUrl = url.parse(window.location.href, true);
global.MAPBOX_MAP_ID = 'map-communities.ib23mbhk';
global.SERVER_BASE_URL = 'http://localhost:8000';

// TODO: get fancy w/ requiring the pathname
if (parsedUrl.pathname == '/') {
  var map = L.mapbox.map('map', MAPBOX_MAP_ID).setView([37.8102589045, -122.265385309], 12);
  require('./js/index')(map);
} else if (parsedUrl.pathname == '/point.html') {
  require('./js/point')(parsedUrl);
}
