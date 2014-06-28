#!/usr/bin/env node
var core = require('map-communities-core');
var ds = require('map-communities-data-mongodb');
var st = require('st');
var path = require('path');

var dataset = new ds.DataSet('localhost', 'oakland-map')
dataset.connect(function () {
  core(dataset, addRoutes);
});

mountPoint = path.resolve(__dirname, '..', 'public');
console.log(mountPoint);
var mount = st({
  path: mountPoint,
  index: 'index.html'
});

function addRoutes(router) {
  router.addRoute('*', function(req, res) {
    console.log(req.url);
    mount(req, res);
  });
};
