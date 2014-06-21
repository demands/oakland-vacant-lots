require('mapbox.js');
require('leaflet.markercluster');

// options:
//   mapboxId: <String> mapbox map id
//   popup: <Function> single argument with parcel, should return html for a parcel popup
//   filterCategory: <Array> list of categories that we'll want to filter against
function filterableClusterMap(domRef, options) {
  this.options = options;

  this.map = L.mapbox.map(domRef, this.options.mapboxId);

  // TODO how to set default view?
  this.map.setView([37.8102589045, -122.265385309], 12);

  this.clusterLayer = new L.MarkerClusterGroup();
  this.map.addLayer(this.clusterLayer);

  this.markers = [];
  this.filters = [];
};

module.exports = filterableClusterMap;

filterableClusterMap.prototype.addBulk = function addBulk(parcels) {
  var popupHtml = this.options.popup;
  var markers = this.markers;

  [].concat.apply(this.markers, parcels.map(function(parcel) {

    var latLng = new L.LatLng(
      parcel.geometry.coordinates[1],
      parcel.geometry.coordinates[0]
    );

    var marker = L.marker(latLng, {
      icon: L.mapbox.marker.icon(),
      title: parcel.properties.Address
    });

    marker.bindPopup(popupHtml(parcel.properties));
    marker.properties = parcel.properties;

    markers.push(marker);

    return marker;
  }));

  this.render();
};

filterableClusterMap.prototype.setFilters = function setFilters(filters) {
  this.filters = filters;
  this.render();
};

filterableClusterMap.prototype.render = function render() {
  var showingMarkers = [];
  var filters = this.filters;

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

  this.clusterLayer.clearLayers();
  this.clusterLayer.addLayers(showingMarkers);
};
