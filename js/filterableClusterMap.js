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

  this.layerCategories = {};
  this.options.filterCategories.forEach(function(category) {
    this.layerCategories[category] = {};
  }.bind(this));
};

module.exports = filterableClusterMap;

filterableClusterMap.prototype.addBulk = function addBulk(parcels) {
  var popupHtml = this.options.popup;
  var layerCategories = this.layerCategories;

  this.clusterLayer.addLayers(parcels.map(function(parcel) {

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

    Object.keys(layerCategories).forEach(function(category) {
      var value = parcel.properties[category];
      if(!value) return;
      if(!layerCategories[category][value]) layerCategories[category][value] = [];
      layerCategories[category][value].push(marker);
    }.bind(this));

    return marker;
  }));
};

filterableClusterMap.prototype.filterCategory = function filterCategory(category, values) {
  var layerCategories = this.layerCategories;
  if(!layerCategories[category]) return;

  var markers = [].concat.apply([], values.map(function(value) {
    return layerCategories[category][value];
  }));

  this.clusterLayer.clearLayers();
  this.clusterLayer.addLayers(markers);
};

