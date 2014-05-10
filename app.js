var url = require('url');
var parsedUrl = url.parse(window.location.href, true);

// TODO: get fancy w/ requiring the pathname
if (parsedUrl.pathname == '/') {
  require('./js/index')();
} else if (parsedUrl.pathname == '/point.html') {
  require('./js/point')(parsedUrl);
}
