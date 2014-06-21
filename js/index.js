var filterableClusterMap = require('./filterableClusterMap');
var $ = require('jquery');
var elessar = require('elessar');
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
    el = $(document.body).find('#map-container');
  }
  if (!map) {
    var mapEl = $('<div>').addClass('map');
    $(el).append(mapEl);
    map = new filterableClusterMap(mapEl[0], {popup: popupHtml, mapboxId: MAPBOX_MAP_ID, filterCategories: ['gen_use']});
  }

  var $controls = $("<div>").addClass('controls');
  $controls.change('input', filtersChanged);

  var $size = $("<div>").addClass('acreage').appendTo($controls);
  var $use = $("<div>").addClass('gen_use').html("<b>Category:</b> ").appendTo($controls);
  var slider;

  $.getJSON(SERVER_BASE_URL + '/points', function(data) {
    var categories = [];
    var minRange = Infinity, maxRange = -Infinity;

    map.addBulk(data.features);
    data.features.forEach(function(feature) {
      var use = feature.properties.gen_use;
      if(feature.properties.acreage < minRange) {
        minRange = feature.properties.acreage;
      }
      if (feature.properties.acreage > maxRange) {
        maxRange = feature.properties.acreage;
      }

      if(categories.indexOf(use) < 0) {
        categories.push(use);
        $use.append($('<label><input type="checkbox" value="'+ use + '" checked> ' + use + '</label>'));
      }
    });

    slider = new elessar({
      min: minRange,
      max: maxRange,
      valueFormat: parseInt,
      valueParse: parseInt,
      values: [[1,15]],
      label: function(a){
        return "" + a[0] + " - " + a[1] + " acres";
      },
      snap: 1,
      minSize: 1,
      barClass: 'progress',
      rangeClass: 'bar',
      maxRanges: 1
    });
    slider.on('change', filtersChanged);
    $size.append(slider.$el);

    $(el).append($controls);
  });

  function filtersChanged() {
    var childCategories = $controls.find(":checked").map(function (idx, box){
      return $(box).val();
    }).toArray();
    var sliderVal = slider.val()[0];
    map.setFilters([
      {attr: 'gen_use', values: childCategories},
      {attr: 'acreage', range: {min: sliderVal[0], max: sliderVal[1]}}
    ]);
  }
};
