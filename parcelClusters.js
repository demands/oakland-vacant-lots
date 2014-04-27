require('leaflet.markercluster');

function popupHtml(properties) {
  return '<h1><a href="./point/' + properties.TARGET_FID + '">' + properties.Address + '</a></h1>' +
    'Category: ' + properties.SpecUse + '<br/>' +
    'Acres: ' + properties.Acre + '<br/>' +
    'Square Ft: ' + properties["SqFt\r"] + '<br/>' +
    'FID Parcel: ' + properties.FID_PARCEL;
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
