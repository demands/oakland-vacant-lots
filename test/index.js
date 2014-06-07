var test = require('tape');
var index = require('../js/index.js');
var $ = require('jquery');

global.SERVER_BASE_URL = 'http://localhost:8000';

function logRequests() {
  var xhr = sinon.useFakeXMLHttpRequest();
  requests = [];

  xhr.onCreate = function(req) {
    requests.push(req);
  };

  return requests;
}

var stubbedMap = {
  addBulk: sinon.stub(),
  filterCategory: sinon.stub()
};

test('index: requests all points', function(t) {

  t.plan(1);

  var requests = logRequests()
  index($('<div>'), stubbedMap);
  var request = requests[0];

  request.respond(200, { "Content-Type": "application/json" }, "{features: []}");
  t.equal(request.url, SERVER_BASE_URL + "/points");

});

test('index: filter checkboxes are created based on categories', function(t) {
  t.plan(3);

  var requests = logRequests();

  var el = $('<div>');
  index(el, stubbedMap);

  // Fake XHR with our data in it
  var request = requests[0];
  var response = require('./example_features.json');
  request.respond(200, { "Content-Type": "application/json" }, JSON.stringify(response));

  var input = el.find('input');
  t.equal(input.length, 2);
  t.equal($(input[0]).val(), 'Exempt');
  t.equal($(input[1]).val(), 'Residential');
});

test('index: filter checkboxes work', function(t) {
  t.plan(2);

  var requests = logRequests()

  var el = $('<div>');
  index(el, stubbedMap);

  // Fake XHR with our data in it
  var request = requests[0];
  var response = require('./example_features.json');
  request.respond(200, { "Content-Type": "application/json" }, JSON.stringify(response));

  var input = el.find('input[value=Exempt]');
  input.prop('checked', true).change();
  t.ok(stubbedMap.filterCategory.calledWith('gen_use', ['Exempt']), 'populated filter params');

  input.prop('checked', false).change();
  t.ok(stubbedMap.filterCategory.calledWith('gen_use', []), 'emptied filter params');
});
