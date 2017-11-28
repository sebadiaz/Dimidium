'use strict';


const ApiService = require('../ApiService');

exports.createDefinition = function() {
  var newResource = {
    apiVersion: 'apiextensions.k8s.io/v1beta1',
    kind: 'CustomResourceDefinition',
    metadata: {
      name: `newresources.dimidium.enablecloud.github.com`
    },
    spec: {
      group: dimidium.enablecloud.github.com,
      version: 'v1',
      scope: 'Namespaced',
      names: {
        plural: 'dimApp',
        singular: 'dimApps',
        kind: 'DimApplication',
        shortNames: [
          'diap'
        ]
      }
    }
  };
  var core=ApiService.getExt();
  core.customresourcedefinition.post({ body: newResource }, , next);
  
}

exports.create = function(workspace,name,components) {
  var manifest = {
    apiVersion: `dimidium.enablecloud.github.com/v1`,
    kind: 'DimApplication',
    metadata: {
      name: name,
      labels: 
        {worspace: workspace}
      
    },
    spec: {
      workspace:workspace,
      components: {
        items:[    ]
      }
    }

  };
  var arrayLength = services.length;
  for (var i = 0; i < arrayLength; i++) {
      var helmName=services[i]['name'];
      var version=services[i]['version'];
      manifest['spec']['components']['items'].add({helmname:helmName,helmVersion:version});

  }
  var core=ApiService.getCRD();
  core.ns
  .dimApps
  .post({ body: manifest }, next);
  
}
exports.delete = function(namespace) {
    var core=ApiService.getExt();
    core.ns
    .dimApps.delete({ name: namespace }, next);

  
}