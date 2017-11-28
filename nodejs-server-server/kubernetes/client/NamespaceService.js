'use strict';

function print(err, result) {
    console.log(JSON.stringify(err || result, null, 2));
  }
  
const ApiService = require('./ApiService');
exports.createNamespace = function(namespace,workspace) {
  console.log('Create namespace %s on workspace %s',namespace , workspace);
  var core=ApiService.getCore();
  //require('request').debug = true
  var toPost={'body': {'apiVersion': 'v1','kind': 'Namespace','metadata': {'name': namespace }}};
  core.namespaces.post(toPost, print);
  
}
exports.deleteNamespace = function(namespace) {
    var core=ApiService.getCore();
    core.ns.delete({ name: namespace }, print);

  
}