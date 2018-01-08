'use strict';

function print(err, result) {
    console.log(JSON.stringify(err || result, null, 2));
  }
  
const ApiService = require('./ApiService');
exports.createNamespace = function(namespace,workspace,username,callback) {
  console.log('Create namespace %s on workspace %s',namespace , workspace);
  var core=ApiService.getCore();
  //
  var toPost={'body': {'apiVersion': 'v1','kind': 'Namespace','metadata': {'name': namespace ,'labels':{workspace:workspace,username:username}}}};
  core.namespaces.post(toPost, callback);
  
}
exports.deleteNamespace = function(namespace) {
    var core=ApiService.getCore();
    core.ns.delete({ name: namespace }, print);

  
}