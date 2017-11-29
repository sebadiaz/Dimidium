
'use strict';

const Api = require('kubernetes-client');
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

exports.getExt = function() {
    var core;
    try {
        core = new Api.Extensions(Api.config.getInCluster());
    }
    catch(err) {
        core = new Api.Extensions(Api.config.fromKubeconfig());
    }
    return core;
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
