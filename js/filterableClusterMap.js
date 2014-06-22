require('mapbox.js');
require('leaflet.markercluster/dist/leaflet.markercluster-src.js');

// options:
//   mapboxId: <String> mapbox map id
//   popup: <Function> single argument with parcel, should return html for a parcel popup
//   filterCategory: <Array> list of categories that we'll want to filter against
function filterableClusterMap(domRef, options) {
  this.options = options;
  var popupHtml = this.options.popup;

  this.map = L.mapbox.map(domRef, this.options.mapboxId);

  // TODO how to set default view?
  this.map.setView([37.8102589045, -122.265385309], 12);

  this.clusterLayer = new L.MarkerClusterGroup({
    chunkedLoading: true,
    chunkProgress: function(processed, total, elapsed) {
      console.log(processed, total, elapsed);
    }
  });
  this.map.addLayer(this.clusterLayer);

  this.clusterLayer.on('click', function(e) {
    var marker = e.layer;
    if (!marker.properties) return;
    if (!marker.getPopup()) marker.bindPopup(popupHtml(marker.properties)).openPopup();
  });

  this.markers = [];
  this.filters = [];
};

module.exports = filterableClusterMap;

filterableClusterMap.prototype.addBulk = function addBulk(parcels) {
  var markers = this.markers;

  console.time('making markers');
  [].concat.apply(this.markers, parcels.map(function(parcel) {

    var latLng = new L.LatLng(
      parcel.geometry.coordinates[1],
      parcel.geometry.coordinates[0]
    );

    var marker = L.marker(latLng, {
      icon: L.mapbox.marker.icon(),
      title: parcel.properties.Address
    });

    marker.properties = parcel.properties;

    markers.push(marker);

    return marker;
  }));
  console.timeEnd('making markers');

  this.render();
};

filterableClusterMap.prototype.setFilters = function setFilters(filters) {
  this.filters = filters;
  this.render();
};

filterableClusterMap.prototype.render = function render() {
  var showingMarkers = [];
  var filters = this.filters;

  console.time('filtering');
  // do the filtering work
  this.markers.forEach(function(marker) {
    var match = filters.every(function(filter) {
      var attr = marker.properties[filter.attr];
      if (filter.values) return (filter.values.indexOf(attr) >= 0);
      if (filter.range) return (filter.range.min < attr && filter.range.max > attr);
      return true;
    });
    if(match) showingMarkers.push(marker);
  });
  console.timeEnd('filtering');

  console.time('clearing')
  this.clusterLayer.clearLayers();
  console.timeEnd('clearing')
  console.time('adding')
  console.profile('addLayers')
  this.clusterLayer.addLayers(showingMarkers);
  console.profileEnd('addLayers');
  console.timeEnd('adding')
};
