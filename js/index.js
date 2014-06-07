var filterableClusterMap = require('./filterableClusterMap');
var $ = require('jquery');
var Mustache = require('mustache');

function popupHtml(properties) {
  var popupTemplate = '<h1><a href="./point.html?point={{id}}">{{address}}</a></h1>' +
    'Category: {{spec_use}}<br/>' +
    'Acres: {{acreage}}<br/>' +
    'Square Ft: {{square_footage}}<br/>' +
    'FID Parcel: {{fid_parcel}}';

    return Mustache.render(popupTemplate, properties);
}

module.exports = function(el, map) {
  if (!el) {
    el = document.body;
  }
  if (!map) {
    map = new filterableClusterMap($(el).find('#map')[0], {popup: popupHtml, mapboxId: MAPBOX_MAP_ID});
  }

  $.getJSON(SERVER_BASE_URL + '/points', function(data) {
    map.addBulk(data.features);
  });

  $(el).find('#controls input').change(function () {
    var childCategories = $(el).find("#controls :checked").map(function (idx, box){
      return $(box).val();
    }).toArray();
    map.filterCategory(childCategories);
  });
};
