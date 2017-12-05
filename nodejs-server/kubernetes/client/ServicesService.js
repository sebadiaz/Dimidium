'use strict';

function print(err, result) {
    console.log(JSON.stringify(err || result, null, 2));
  }
  
const ApiService = require('./ApiService');
exports.getServices = function(namespace,callback,options) {
  console.log('get services namespace %s',namespace );
  var core=ApiService.getCore(true);
  //
  core.namespaces(namespace).services.get().then(result => {callback(result,options);});
  
}

exports.patchAnnotation = function(namespace,name,key,value) {
  console.log('patchAnnotation namespace %s',namespace );
  var core=ApiService.getCore(true);
  var data= {'body':{metadata:{annotations:{}}}};
  data['body']['metadata']['annotations'][key]=value;
  core.namespaces(namespace).services(name).patch(data,print);
  
}