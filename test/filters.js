var features = {"type":"FeatureCollection","features":[
{"type":"Feature","geometry":{"type":"Point","coordinates":["-122.26538530900","37.81025890450"]},"properties":{"target_fid":"4","object_id":"1018","apn":"8-653-14-1","created_at":"2004-06-07T07:00:00.000Z","updated_at":"2004-06-07T07:00:00.000Z","fid_parcel":"2977","address":"2150 Webster St","city":"Oakland","state":"CA","zip":"94612","owner":"Pacific Bell 279-1-43-2","owner_address":"San Ramon, CA","owner_zip":"94583","use_code":"500","use_desc":"Property owned by a public utility","spec_use":"Exempt","gen_use":"Exempt","base_zone":"CBD-C","overlay":"","zone_label":"CBD-C","acreage":"0.58595","square_footage":"25523.82704"}},
{"type":"Feature","geometry":{"type":"Point","coordinates":["-122.26843971700","37.80700285960"]},"properties":{"target_fid":"26","object_id":"3879","apn":"8-623-6-1","created_at":"2004-06-07T07:00:00.000Z","updated_at":"2004-06-07T07:00:00.000Z","fid_parcel":"6524","address":"1731 Franklin St","city":"Oakland","state":"CA","zip":"94612","owner":"City of Oakland","owner_address":"Oakland, CA","owner_zip":"94612","use_code":"300","use_desc":"Exempt Public Agency","spec_use":"Exempt","gen_use":"Exempt","base_zone":"CBD-C","overlay":"","zone_label":"CBD-C","acreage":"1.02660","square_footage":"44718.79482"}},
{"type":"Feature","geometry":{"type":"Point","coordinates":["-122.30388804900","37.80709750420"]},"properties":{"target_fid":"74","object_id":"463","apn":"6-43-30-2","created_at":"2004-06-07T07:00:00.000Z","updated_at":"2004-06-07T07:00:00.000Z","fid_parcel":"877","address":"1833 7th Ave","city":"Oakland","state":"CA","zip":"94606","owner":"United States of America","owner_address":"Oakland, CA","owner_zip":"94606","use_code":"300","use_desc":"Exempt Public Agency","spec_use":"Exempt","gen_use":"Exempt","base_zone":"CIX-1","overlay":"/S-19","zone_label":"CIX-1/S-19","acreage":"0.01359","square_footage":"591.85622"}},
{"type":"Feature","geometry":{"type":"Point","coordinates":["-122.30460664900","37.80622368730"]},"properties":{"target_fid":"88","object_id":"816","apn":"6-43-26","created_at":"2004-06-07T07:00:00.000Z","updated_at":"2004-06-07T07:00:00.000Z","fid_parcel":"2765","address":"1816 Atlantic St","city":"Oakland","state":"CA","zip":"94607","owner":"State, CAlifornia","owner_address":"Oakland, CA","owner_zip":"94623","use_code":"500","use_desc":"Property owned by a public utility","spec_use":"Exempt","gen_use":"Exempt","base_zone":"CIX-1","overlay":"","zone_label":"CIX-1","acreage":"0.25061","square_footage":"10916.63854"}},
{"type":"Feature","geometry":{"type":"Point","coordinates":["-122.30310105300","37.80611605910"]},"properties":{"target_fid":"97","object_id":"1093","apn":"6-39-24-4","created_at":"2004-06-07T07:00:00.000Z","updated_at":"2004-06-07T07:00:00.000Z","fid_parcel":"3064","address":"425 Wood St","city":"Oakland","state":"CA","zip":"94607","owner":"United States of America","owner_address":"Oakland, CA","owner_zip":"94612","use_code":"300","use_desc":"Exempt Public Agency","spec_use":"Exempt","gen_use":"Exempt","base_zone":"CIX-1","overlay":"","zone_label":"CIX-1","acreage":"0.11775","square_footage":"5129.29029"}},
{"type":"Feature","geometry":{"type":"Point","coordinates":["-122.30352179000","37.80610602390"]},"properties":{"target_fid":"99","object_id":"1097","apn":"6-39-29-4","created_at":"2004-06-07T07:00:00.000Z","updated_at":"2004-06-07T07:00:00.000Z","fid_parcel":"3068","address":"5th St","city":"Oakland","state":"CA","zip":"94607","owner":"State of, CAlifornia","owner_address":"Oakland, CA","owner_zip":"94607","use_code":"300","use_desc":"Exempt Public Agency","spec_use":"Exempt","gen_use":"Exempt","base_zone":"CIX-1","overlay":"","zone_label":"CIX-1","acreage":"0.02806","square_footage":"1222.25569"}}
]};

var test = require('tape');
var index = require('../js/index.js');
var $ = require('jquery');

global.MAPBOX_MAP_ID = 'map-communities.ib23mbhk';
global.SERVER_BASE_URL = 'http://localhost:8000';

var map = L.mapbox.map('map', MAPBOX_MAP_ID).setView([37.8102589045, -122.265385309], 12);

function logRequests() {
  var xhr = sinon.useFakeXMLHttpRequest();
  requests = [];

  xhr.onCreate = function(req) {
    requests.push(req);
  };

  return requests;
}

test('index: requests all points', function(t) {

  t.plan(1);

  var requests = logRequests()
  index(map);
  var request = requests[0];

  request.respond(200, { "Content-Type": "application/json" }, "{features: []}");
  t.equal(request.url, SERVER_BASE_URL + "/points");

});

// test('index: filters filter', function(t) {

//   t.plan(1);

//   var requests = logRequests()
//   index(map);
//   var request = requests[0];

//   request.respond(200, { "Content-Type": "application/json" }, JSON.stringify(features));
//   window.setTimeout(function() {$("#controls [value=Exempt]").click();}, 0);

// });
