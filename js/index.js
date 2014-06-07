var filterableClusterMap = require('./filterableClusterMap');
var $ = require('jquery');
var Mustache = require('mustache');

function popupHtml(properties) {
  var popupTemplate = '<h1><a href="./point.html?point={{target_fid}}">{{address}}</a></h1>' +
    'Category: {{spec_use}}<br/>' +
    'Acres: {{acreage}}<br/>' +
    'Square Ft: {{square_footage}}<br/>' +
    'FID Parcel: {{fid_parcel}}';

    return Mustache.render(popupTemplate, properties);
}

module.exports = function(map) {
  if (!map) {
    map = new filterableClusterMap($('#map')[0], {popup: popupHtml, mapboxId: MAPBOX_MAP_ID});
  }

  $.getJSON(SERVER_BASE_URL + '/points', function(data) {
    console.log("adding markers", data);
    map.addBulk(data.features);
  });

  $('#controls').click("input", function (e) {
    console.log("handling click");
    var childCategories = $(e.currentTarget).children(":checked").map(function (idx, c){
      return $(c).val();
    }).toArray();
    map.filterCategory(childCategories);
  });
};
