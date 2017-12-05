'use strict';

function print(err, result) {
    console.log(JSON.stringify(err || result, null, 2));
  }
  
const ApiService = require('./ApiService');
exports.createConfigMap = function(namespace,worspace,name) {
  console.log('Create configmap %s on workspace %s on namespace %s.',name , workspace,namespace);
  var core=ApiService.getCore();
  //
  var toPost={'body': {'apiVersion': 'v1','kind': 'ConfigMap','metadata': {'name': name ,'namespace': namespace ,'labels':{workspace:workspace}}}};
  core.ns(namespace).configmaps.post(toPost, print);
  
}
exports.deleteConfigMap = function(name,namespace) {
    var core=ApiService.getCore();
    core.ns(namespace).configmaps.delete({ name: name }, print);

  
}

exports.patchConfigMap = function(name,namespace,key,value) {
  var core=ApiService.getCore();
  var data= {data:{}};
  data[key]=value
  core.ns(namespace).configmaps.patch(name)(data, print);


}