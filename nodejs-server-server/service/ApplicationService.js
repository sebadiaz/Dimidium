
'use strict';
var DimAppice = require('../kubernetes/client/DimAppService');
var Namespace = require('../kubernetes/client/NamespaceService');

var Helm = require('../kubernetes/helm/HelmService');
/**
 * Add a new pet to the store
 * 
 *
 * body Pet Pet object that needs to be added to the store
 * no response value expected for this operation
 **/
exports.createApp = function(body) {
 DimAppice.createDefinition();
 
    var str = JSON.stringify(body);
    console.log('body %s %s',str , body);
  var name = body['application']['value']['name'];
  var workspace = body['application']['value']['workspace'];
  var services = body['application']['value']['services'];
  var namespace = workspace+"-"+name;
  namespace=namespace.toLowerCase();
  //Create service
  Namespace.createNamespace(namespace,workspace);
  //Install Service
  var arrayLength = services.length;
  for (var i = 0; i < arrayLength; i++) {
      var helmName=services[i]['name'];
      var version=services[i]['version'];
      var releasename=namespace+"-"+helmName.replace('/', '-');
      Helm.installRelease(helmName,version,namespace,releasename);

  }
  DimAppice.create(workspace,namespace,services);
    
  return namespace;
}