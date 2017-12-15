'use strict';
var async = require('async');

const ApiService = require('./ApiService');
function print(err, result) {
  console.log(JSON.stringify(err || result, null, 2));
}
exports.createDefinition = function() {
  var newResource = {
    apiVersion: 'apiextensions.k8s.io/v1beta1',
    kind: 'CustomResourceDefinition',
    metadata: {
      name: `dimapps.dimidium.enablecloud.github.com`
    },
    spec: {
      group: 'dimidium.enablecloud.github.com',
      version: 'v1',
      scope: 'Namespaced',
      names: {
        plural: 'dimapps',
        singular: 'dimapp',
        kind: 'DimApplication',
        shortNames: [
          'diap'
        ]
      }
    }
  };
  var core=ApiService.getCRD();
  core.customresourcedefinition.post({ body: newResource } ,print);
  
}

exports.create = function(workspace,name,components) {
  var manifest = {
    apiVersion: `dimidium.enablecloud.github.com/v1`,
    kind: 'DimApplication',
    metadata: {
      name: name,
      labels: 
        {
          workspace: workspace,
          namespace:name

        }
      
    },
    spec: {
      workspace:workspace,
      components: {
        items:[    ]
      }
    }

  };
  var arrayLength = components.length;
  for (var i = 0; i < arrayLength; i++) {
      var helmname=components[i]['name'];
      var version=components[i]['version'];
      var deployname=components[i]['deployname'];
      var releasename=components[i]['releasename'];
      var parameters=components[i]['parameters'];
      manifest['spec']['components']['items'].push({helmname:helmname,deployname:deployname,helmversion:version,releasename:releasename,parameters:parameters});

  }

  var custom=ApiService.getCustomResource("dimidium.enablecloud.github.com");
  var core=ApiService.getCRD();
  console.log("Add resource "+JSON.stringify(manifest));
  custom.addResource('dimapps');
  custom.ns.dimapps.post({ body: manifest },  print);
  core.customresourcedefinition.post({ body: manifest },  print);
  //core.ns
  //.dimapps
  //.post({ body: manifest }, print);
  
}




exports.get = function(name,callback,options) {
  var custom=ApiService.getCustomResource("dimidium.enablecloud.github.com",true);
  custom.addResource('dimapps');
  const res = custom.ns.dimapps(name).get().then(result => {callback(result,options);},error => {callback(error,options);});
  
  return res;
  
  
}


exports.list = function(callback,options) {
  var custom=ApiService.getCustomResource("dimidium.enablecloud.github.com",true);
  custom.addResource('dimapps');
  const res = custom.ns.dimapps.get().then(result => {callback(result,options);},error => {callback(error,options);});
  
  return res;
  
  
}

exports.delete = function(namespace) {
  var custom=ApiService.getCustomResource("dimidium.enablecloud.github.com",true);
  custom.addResource('dimapps');
  const res = custom.ns.dimapps.delete({ name: namespace }, print);

  
}


exports.patch = function(appId,manifest) {
  var custom=ApiService.getCustomResource("dimidium.enablecloud.github.com");
  
  console.log("Add resource "+JSON.stringify(manifest));
  custom.addResource('dimapps');
  custom.ns.dimapps(appId).patch({ body: manifest },  print);
  
  
}

exports.update = function(appId,manifest) {
  var custom=ApiService.getCustomResource("dimidium.enablecloud.github.com");
  
  console.log("Add resource "+JSON.stringify(manifest));
  custom.addResource('dimapps');
  custom.ns.dimapps(appId).put({ body: manifest },  print);
  
  
}
