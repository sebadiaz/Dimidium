'use strict';
const exec = require('child_process').exec;

function print(err, result) {
  console.log(JSON.stringify(err || result, null, 2));
}


/**
 * Add a new pet to the store
 * 
 *
 * body Pet Pet object that needs to be added to the store
 * no response value expected for this operation
 * InstallRelease(release string, version string, namespace string, releasename string,
 **/
exports.installRelease = function(release,version,namespace,releasename) {
  var cmd='helm install '+release+' --version '+version+' -n '+releasename+' --namespace '+namespace;
  if (!version || version == "" ){
    cmd='helm install '+release+' -n '+releasename+' --namespace '+namespace;
  }
  exec(cmd,print);
  
  
}
exports.deleteRelease = function(releasename) {
  exec('helm delete --purge '+releasename,print);
  
}