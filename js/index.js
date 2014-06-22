var filterableClusterMap = require('./filterableClusterMap');
var $ = require('jquery');
var elessar = require('elessar');
var Mustache = require('mustache');

function twoSigFigs(val) {
  return Math.round(val * 100) / 100;
}

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
  var minRange = Infinity, maxRange = -Infinity;

  console.timeStamp('downloading points');
  console.time('downloading points')
  $.getJSON(SERVER_BASE_URL + '/points', function(data) {
    console.timeEnd('downloading points');
    var categories = [];

    console.time('addBulk');
    map.addBulk(data.features);
    console.timeEnd('addBulk');

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
      min: 0,
      max: 3,
      valueFormat: twoSigFigs,
      valueParse: twoSigFigs,
      values: [[0,3]],
      label: function(a){
        if(a[1] === 3) {
          a[1] = "3+";
        }
        return "" + a[0] + " - " + a[1] + " acres";
      },
      snap: 0.01,
      minSize: 0.10,
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
    if(sliderVal[1] === 3) sliderVal[1] = maxRange;
    map.setFilters([
      {attr: 'gen_use', values: childCategories},
      {attr: 'acreage', range: {min: sliderVal[0], max: sliderVal[1]}}
    ]);
  }
};
