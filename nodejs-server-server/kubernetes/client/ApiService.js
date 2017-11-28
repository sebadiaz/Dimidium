
const Api = require('kubernetes-client');
exports.getCore = function() {
    
    var core;
    try {
        core = new Api.Core(Api.config.getInCluster());
    }
    catch(err) {
        core = new Api.Core(Api.config.fromKubeconfig());
    }
    var str = JSON.stringify(core);
    //console.log('ConfigPath %s',str)
    return core;
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
