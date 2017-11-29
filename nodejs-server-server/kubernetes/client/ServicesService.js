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