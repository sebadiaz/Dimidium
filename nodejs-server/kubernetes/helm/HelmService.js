'use strict';
const exec = require('child_process').exec;

function print(err, result) {
  console.log(JSON.stringify(err || result, null, 2));
}


const getPath= function () {
  var path = ".";
  if(process.argv.indexOf("--helmpath") != -1){ //does our flag exist?
    path = process.argv[process.argv.indexOf("--helmpath") + 1]; //grab the next item
  }

  return path;
}

const getHelmPath= function () {
  var path =getPath();
  if(path){
    return 'cd "'+path+'";helm' 
  }
  return 'helm' 
}


/**
 * Add a new pet to the store
 * 
 *
 * body Pet Pet object that needs to be added to the store
 * no response value expected for this operation
 * InstallRelease(release string, version string, namespace string, releasename string,
 **/
exports.installRelease = function(release,version,namespace,releasename,keys) {
  var cmd=getHelmPath()+' install '+release+' --version '+version+' -n '+releasename+' --namespace '+namespace + ' --set '+keys;
  if (!version || version == "" ){
    cmd=getHelmPath()+' install '+release+' -n '+releasename+' --namespace '+namespace+ ' --set '+keys;
  }
  exec(cmd,print);
  
  
}
exports.deleteRelease = function(releasename) {
  exec('helm delete --purge '+releasename,print);
  
}


exports.listRelease = function(releasename) {
  exec('helm list',print);
  
}