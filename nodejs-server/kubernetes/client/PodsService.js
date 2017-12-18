'use strict';

function print(err, result) {
    console.log(JSON.stringify(err || result, null, 2));
  }
  
const ApiService = require('./ApiService');
exports.getPods = function(namespace,callback,options) {
  console.log('get services namespace %s',namespace );
  var core=ApiService.getCore(true);
  //
  core.namespaces(namespace).pods.get().then(result => {callback(result,options);});
  
}

exports.getPodsExtra = function(body,options,fn) {
  console.log('get services namespace dddddddddddddddddddddddd' );
  console.log('get services namespace %s',body );

  var core=ApiService.getCore(true);
  //
  core.namespaces(body).pods.get().then(result => {fn(result,options,options.fns.shift());});
  
}

exports.patchAnnotation = function(namespace,name,key,value) {
  console.log('patchAnnotation namespace %s',namespace );
  var core=ApiService.getCore(true);
  var data= {'body':{metadata:{annotations:{}}}};
  data['body']['metadata']['annotations'][key]=value;
  core.namespaces(namespace).pods(name).patch(data,print);
  
}