var url = require('url');
var parsedUrl = url.parse(window.location.href, true);
global.MAPBOX_MAP_ID = 'map-communities.ib23mbhk';
global.SERVER_BASE_URL = 'http://localhost:8000';

// TODO: get fancy w/ requiring the pathname
if (parsedUrl.pathname == '/') {
  require('./js/index')();
} else if (parsedUrl.pathname == '/point.html') {
  require('./js/point')(parsedUrl);
}
