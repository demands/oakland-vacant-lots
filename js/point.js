require('mapbox.js');
var Mustache = require('mustache');
var $ = require('jquery');
var GoogleMapsLoader = require('google-maps');

module.exports = function(parsedUrl) {
  var pointId = parsedUrl.query.point;
  if (pointId) {
    $.getJSON(SERVER_BASE_URL + '/points/' + pointId, function(data) {

      var coords = data.geometry.coordinates;
      GoogleMapsLoader.load(function(google) {
        var sv = new google.maps.StreetViewService();
        var pointPos = new google.maps.LatLng(coords[1], coords[0]);

        sv.getPanoramaByLocation(pointPos, 50, function (data, status){
          if (status == google.maps.StreetViewStatus.OK) {
            var street_view_options = {
              pov: {
                heading: 165,
                pitch: 0
              },
              zoom: 1
            };

            var street_view = new google.maps.StreetViewPanorama(
              document.getElementById('street-view'),
              street_view_options);
            var street_view_pano_id = data.location.pano;
            street_view.setPano(street_view_pano_id);
            street_view.setVisible(true);
          }
        });

        var map = L.mapbox.map('map-view', MAPBOX_MAP_ID).setView([coords[1], coords[0]], 14);
        L.mapbox.featureLayer(data).addTo(map);

      });

      var template = $('#point-template').html();
      var output = Mustache.render(template, data.properties);
      $('#point-info').html(output);

      var template = $('#point-template2').html();
      var output = Mustache.render(template, data.properties);
      $('#point-info2').html(output);
    });
  }

  $('#organize-btn').click(function(e) {
    e.preventDefault();
    closeAllModals();
    showModal($('#organize-modal'));
  });

  $('#report-btn').click(function(e) {
    e.preventDefault();
    closeAllModals();
    showModal($('#report-modal'));
  });

  function showModal(modal) {
    modal.css("top", Math.max(0, (($(window).height() - modal.outerHeight()) / 2) +
                                                $(window).scrollTop()) + "px");
    modal.css("left", Math.max(0, (($(window).width() - modal.outerWidth()) / 2) +
                                                $(window).scrollLeft()) + "px");
    modal.show();
  }

  $('.close').click(closeAllModals);
  function closeAllModals() {
    $('.dialog').hide();
  }

  $('#submit-organize').click(function(e){

    var data = {
      name: $('#organize-form #name').val(),
      type: $('#organize-form #type').val(),
      url: $('#organize-form #url').val(),
      email: $('#organize-form #email').val(),
      phone: $('#organize-form #phone').val(),
      notes: $('#organize-form #notes').val()
    };

    $.ajax({
      type: "POST",
      url: SERVER_BASE_URL + '/organizer/' + pointId,
      data: JSON.stringify(data),
      processData: false,
      success: function(req, status, err){
                  $('#organize-form').hide();
                  $('#organize-form-sent').show();
                },
      error: function(req, status, err){
                var error = JSON.parse(req.responseText);
                $('#organize-form #error').text(error.message);
                $('#organize-form #error').show();
              },
      crossDomain: true // dev only?
    });
  });

  $('#submit-report').click(function(e){

    $.ajax({
      type: "POST",
      url: SERVER_BASE_URL + '/report/' + pointId,
      success: function(req, status, err){
                  $('#submit-report').hide();
                  $('#report-sent').show();
                },
      error: function(req, status, err){
                var error = JSON.parse(req.responseText);
                $('#report-error').text(error.message);
                $('#report-error').show();
              },
      crossDomain: true // dev only?
    });
  });
}