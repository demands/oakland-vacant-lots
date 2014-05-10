require('leaflet.markercluster');
var Mustache = require('mustache');

function popupHtml(properties) {
  var popupTemplate = '<h1><a href="./point.html?point={{TARGET_FID}}">{{Address}}</a></h1>' +
    'Category: {{SpecUse}}<br/>' +
    'Acres: {{Acre}}<br/>' +
    'Square Ft: {{SqFt}}<br/>' +
    'FID Parcel: {{FID_PARCEL}}';

    return Mustache.render(popupTemplate, properties);
}

function parcelMarker(geoJson) {
  var latLng = new L.LatLng(
    geoJson.geometry.coordinates[1],
    geoJson.geometry.coordinates[0]
  );
  var marker = L.marker(latLng, {
    icon: L.mapbox.marker.icon(),
    title: geoJson.properties.Address
  });
  marker.bindPopup(popupHtml(geoJson.properties));
  marker.category = geoJson.properties.SpecUse;
  return marker;
}

L.MarkerClusterGroup.include({
  addBulk: function(parcels) {
    this._markers = parcels.map(function(parcel) {
      return parcelMarker(parcel);
    });
    this.addLayers(this._markers);
  },
  filterCategory: function(categories) {
    this._markers.forEach(function(marker) {
      var showing = this.hasLayer(marker);
      var shouldBeShowing = categories.indexOf(marker.category) >= 0;

      if(showing && !shouldBeShowing) {
        this.removeLayer(marker);
      }
      if(!showing && shouldBeShowing) {
        this.addLayer(marker);
      }
    }.bind(this));
  }
});
