'use strict';
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;
var Config = require('../../tools/Config');
function print(err, result) {
  console.log(JSON.stringify(err || result, null, 2));
}




const getHelmCompPath= function () {
  var path =Config.getHelmPath();
  if(path){
    return 'cd "'+path+'";helm' ;
  }
  return 'helm' ;
}


/**
 * Add a new pet to the store
 * 
 *
 * body Pet Pet object that needs to be added to the store
 * no response value expected for this operation
 * InstallRelease(release string, version string, namespace string, releasename string,
 **/
exports.installRelease = function(release,version,namespace,releasename,keys,callback) {
  var cmd=getHelmCompPath()+' install '+release+' --version '+version+' -n '+releasename+' --namespace '+namespace + ' --set '+keys;
  if (!version || version == "" ){
    cmd=getHelmCompPath()+' install '+release+' -n '+releasename+' --namespace '+namespace+ ' --set '+keys;
  }
  var output={};
  try {
    console.log("launch command :"+cmd);
  
    output = exec(cmd, callback);
    console.log("launched command :"+cmd);
  } catch (ex) {
    output=ex;
    console.log(output);
  }
  
  return output;
  
}
exports.deleteRelease = function(releasename) {
  execSync('helm delete --purge '+releasename);
  
}


exports.listRelease = function(releasename) {
  exec('helm list',print);
  
}


exports.repoIndex = function(dirToIndex,url) {
  execSync(getHelmCompPath()+' repo index '+dirToIndex+' --url '+url);
  
}

exports.repoAdd = function() {
  exec(getHelmCompPath()+' repo add '+Config.getRepoName()+' '+Config.getRepoUrl(),print);
  
}