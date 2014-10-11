var url = require('url');
require('mapbox.js');

var parsedUrl = url.parse(window.location.href, true);
global.MAPBOX_MAP_ID = 'map-communities.ib23mbhk';
global.SERVER_BASE_URL = '/';

// TODO: get fancy w/ requiring the pathname
if (parsedUrl.pathname == '/' || parsedUrl.pathname == '/index.html') {
  require('./js/index')();
} else if (parsedUrl.pathname == '/point.html') {
  require('./js/point')(parsedUrl);
}
