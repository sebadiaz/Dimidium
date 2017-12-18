'use strict';

function print(err, result) {
    console.log(JSON.stringify(err || result, null, 2));
  }
  
const ApiService = require('./ApiService');

function ingress() {
  return {
    kind: 'Ingress',
    apiVersion: 'extensions/v1beta1'
  };
}

exports.getIngresses = function(namespace,callback,options) {
  console.log('get ingress namespace %s',namespace );
  try {  
  var core=ApiService.getGroup(ingress(),true);
  //
  
  console.log('get ingress namespace %s',core.namespaces(namespace) );
  
  
  core.ns(namespace).kind(ingress()).get().then(result => {callback(result,options);});
} catch (e) {
  console.error(e);
}
  //core.namespaces(namespace).ing.get().then(result => {callback(result,options);});
  
}


exports.getIngressesExtra = function(body,options,fn) {
  console.log('get ingress namespace %s',body );
  try {  
  var core=ApiService.getGroup(ingress(),true);
  //
  
  console.log('get ingress namespace %s',core.namespaces(body) );
  
  
  core.ns(body).kind(ingress()).get().then(result => {try { fn(result,options,options.fns.shift());} catch (e) {
    console.error(e);
  }});
} catch (e) {
  console.error(e);
}
  //core.namespaces(namespace).ing.get().then(result => {callback(result,options);});
  
}
