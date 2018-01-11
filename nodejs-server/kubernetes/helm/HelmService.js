'use strict';
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;
var Config = require('../../tools/Config');

const Request = require('./request');

function print(err, result) {
  console.log(JSON.stringify(err || result, null, 2));
};

function getRequest(options) {
  const requestOptions = options.request || {};
  requestOptions.url = options.url;
  requestOptions.path = "";
  requestOptions.ca = options.ca;
  requestOptions.cert = options.cert;
  requestOptions.key = options.key;

  if ('insecureSkipTlsVerify' in options) {
    requestOptions.insecureSkipTlsVerify = options.insecureSkipTlsVerify;
  }
  if (options.auth) {
    requestOptions.auth = options.auth;
  }
  var request=new Request(requestOptions);
  return request;

  
};


const getHelmCompPath= function () {
  var path =Config.getHelmPath();
  if(path){
    return 'cd "'+path+'";helm' ;
  }
  return 'helm' ;
};


const upgradeInstallCMD= function (install,release,version,namespace,releasename,keys,callback) {
  var cmd="";

  if(install){
    var cmd=getHelmCompPath()+' install '+release+' --version '+version+' -n '+releasename+' --namespace '+namespace + ' --set '+keys;
    if (!version || version == "" ){
      cmd=getHelmCompPath()+' install '+release+' -n '+releasename+' --namespace '+namespace+ ' --set '+keys;
    }
  }else{
    cmd=getHelmCompPath()+' upgrade '+releasename+' '+release+' --version '+version+' --namespace '+namespace + ' --set '+keys;
    if (!version || version == "" ){
      cmd=getHelmCompPath()+' upgrade '+releasename+' '+release+' --namespace '+namespace+ ' --set '+keys;
    }
  }
  cmd=cmd+" 2>>1";
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
};

const upgradeInstallVersion= function (install,release,version,namespace,releasename,keys,callback) {
  var cmd={};
  cmd.releaseName=releasename;
  cmd.chartId=release;
  cmd.chartVersion="";
  if(version && version != ""){
    cmd.chartVersion=version;
  }
  cmd.namespace=namespace;
  cmd.values=keys;
  if(!install){
    cmd.update=true;
  }
  console.log("launch command :"+cmd);
  var request=getRequest({url:Config.getMonoUrl()+"/v1/releases"});
  console.log("launch :"+request);
  request.request('POST', { headers: { 'content-type': 'application/json'}, 'path' :'','body':cmd }, callback);
  var output={};
  
  return output;
};

const upgradeInstall= function (install,release,version,namespace,releasename,keys,callback) {
  if(!version || version==""){
    getLatestInn(release,(err,result)=>{
      if (err){
        return callback(err,result);
      }
      upgradeInstallVersion (install,release,result.body['data']['relationships']['latestChartVersion']['data']['version'],namespace,releasename,keys,callback);
    });
  }else{
    return upgradeInstallVersion (install,release,version,namespace,releasename,keys,callback)
  }
};


/**
 * Add a new pet to the store
 * 
 *
 * body Pet Pet object that needs to be added to the store
 * no response value expected for this operation
 * InstallRelease(release string, version string, namespace string, releasename string,
 **/

exports.installRelease = function(release,version,namespace,releasename,keys,callback) {
  this.update((err, result)=>upgradeInstall(true,release,version,namespace,releasename,keys,callback));
  
  
};

exports.upgradeRelease = function(release,version,namespace,releasename,keys,callback) {
  this.update((err, result)=>upgradeInstall(false,release,version,namespace,releasename,keys,callback));
  
};

exports.deleteRelease = function(releasename,cb) {
  
  var request=getRequest({url:Config.getMonoUrl()+"/v1/releases/"+releasename+"?purge=true"});
  request.request('DELETE', {
    headers: { 'content-type': 'application/json' }, 'path' :'' }, cb);
  var output={};
  

  
};

const getLatestInn = function(release,cb) {
  
  var request=getRequest({url:Config.getMonoUrl()+"/v1/charts/"+release});
  request.request('GET', { headers: { 'content-type': 'application/json' }, 'path' :''}, cb);
  var output={};
  

  
};

exports.getLatest = function(release,cb) {
  
  return getLatestInn(release,cb);
  

  
};

const getList = function(cb) {
  
  var request=getRequest({url:Config.getMonoUrl()+"/v1/charts"});
  request.request('GET', { headers: { 'content-type': 'application/json' }, 'path' :''}, cb);
  var output={};
  

  
};

exports.getList = function(cb) {
  
  return getList(cb);
  

  
};

exports.getRelease = function(releasename,cb) {
  
  var request=getRequest({url:Config.getMonoUrl()+"/v1/releases/"+releasename});
  request.request('GET', merge({
    headers: { 'content-type': 'application/json' }
  }, {}), cb);
  var output={};
  

  return output;
};




exports.update = function(callback) {
  callback("","");
  
};


exports.listRelease = function(releasename) {
  exec('helm list',print);
  
};


exports.repoIndex = function(dirToIndex,url) {
  execSync(getHelmCompPath()+' repo index '+dirToIndex+' --url '+url);
  
};

exports.repoAdd = function() {
  exec(getHelmCompPath()+' repo add '+Config.getRepoName()+' '+Config.getRepoUrl(),print);
  
};