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
    map = new filterableClusterMap($(el).find('#map')[0], {popup: popupHtml, mapboxId: MAPBOX_MAP_ID, filterCategories: ['gen_use']});
  }

  var $controls = $("<div>");

  $.getJSON(SERVER_BASE_URL + '/points', function(data) {
    var categories = [];

    map.addBulk(data.features);
    data.features.forEach(function(feature) {
      var use = feature.properties.gen_use;

      if(categories.indexOf(use) < 0) {
        categories.push(use);
        $controls.append($('<label><input type="checkbox" value="'+ use + '">' + use + '</label>'));
      }
    });

    $(el).append($controls);
  });

  $controls.change('input', function () {
    var childCategories = $controls.find(":checked").map(function (idx, box){
      return $(box).val();
    }).toArray();
    map.filterCategory('gen_use', childCategories);
  });
};
