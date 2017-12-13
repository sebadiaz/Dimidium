'use strict';

function print(err, result) {
    console.log(JSON.stringify(err || result, null, 2));
  }
  
const ApiService = require('./ApiService');
exports.getDeployments = function(namespace,callback,options) {
  console.log('get services namespace %s',namespace );
  var core=ApiService.getExt(true);
  //
  core.namespaces(namespace).deployments.get().then(result => {callback(result,options);});
  
}

