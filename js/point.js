var Mustache = require('mustache');
var $ = require('jquery');

module.exports = function(parsedUrl) {
  var pointId = parsedUrl.query.point;
  if (pointId) {
    $.getJSON('http://localhost:8000/point/' + pointId, function(data) {
      var template = $('#point-template').html();

      var output = Mustache.render(template, data);
      $('#point').html(output);
    });
  }
}