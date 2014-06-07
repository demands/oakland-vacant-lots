require('mapbox.js');
require('leaflet.markercluster');

// options:
//   mapboxId: <String> mapbox map id
//   popup: <Function> single argument with parcel, should return html for a parcel popup
function filterableClusterMap(domRef, options) {
  this.options = options;

  this.map = L.mapbox.map(domRef, this.options.mapboxId);

  // TODO how to set default view?
  this.map.setView([37.8102589045, -122.265385309], 12);

  this.clusterLayer = new L.MarkerClusterGroup();
  this.map.addLayer(this.clusterLayer);
};

module.exports = filterableClusterMap;

filterableClusterMap.prototype.addBulk = function addBulk(parcels) {
  popupHtml = this.options.popup;
  this._markers = parcels.map(function(parcel) {

    var latLng = new L.LatLng(
      parcel.geometry.coordinates[1],
      parcel.geometry.coordinates[0]
    );

    var marker = L.marker(latLng, {
      icon: L.mapbox.marker.icon(),
      title: parcel.properties.Address
    });

    marker.bindPopup(popupHtml(parcel.properties));
    marker.category = parcel.properties.SpecUse;
    return marker;
  });
  this.clusterLayer.addLayers(this._markers);
};

filterableClusterMap.prototype.filterCategory = function filterCategory(categories) {
  var clusterLayer = this.clusterLayer;
  this._markers.forEach(function(marker) {
    var showing = clusterLayer.hasLayer(marker);
    var shouldBeShowing = categories.indexOf(marker.category) >= 0;

    if(showing && !shouldBeShowing) {
      clusterLayer.removeLayer(marker);
    }
    if(!showing && shouldBeShowing) {
      clusterLayer.addLayer(marker);
    }
  });
};

