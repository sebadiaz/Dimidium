
'use strict';

const Api = require('kubernetes-client');

exports.getGroup = function(group, promise) {
    var options;
    try {
        options = Api.config.getInCluster();
    }
    catch(err) {
        options = Api.config.fromKubeconfig();
    }
    if (promise){
        options['promises']=true;    
    }
    var api=  new Api.Api(options).group(group);
    return api;
}

exports.getApi = function(promise) {
    var options;
    try {
        options = Api.config.getInCluster();
    }
    catch(err) {
        options = Api.config.fromKubeconfig();
    }
    if (promise){
        options['promises']=true;    
    }
    var api=  new Api(options);
    return api;
}

exports.getCore = function(promise) {
    var options;
    try {
        options = Api.config.getInCluster();
    }
    catch(err) {
        options = Api.config.fromKubeconfig();
    }
    if (promise){
        options['promises']=true;    
    }
    return new Api.Core(options);
}

exports.getExt = function(promise) {
    var options;
    try {
        options = Api.config.getInCluster();
    }
    catch(err) {
        options = Api.config.fromKubeconfig();
    }
    if (promise){
        options['promises']=true;    
    }
    return new Api.Extensions(options);
}

exports.getCRD = function() {
    var core;
    try {
        core = new Api.ApiExtensions(Api.config.getInCluster());
    }
    catch(err) {
        core = new Api.ApiExtensions(Api.config.fromKubeconfig());
    }
    return core;
}

exports.getCustomResource = function(group,promise) {
    var options;
    try {
        options = Api.config.getInCluster();
    }
    catch(err) {
        options = Api.config.fromKubeconfig();
    }
    if (promise){
        options['promises']=true;    
    }
    options['group']=group;
    return new Api.CustomResourceDefinitions(options);
}
