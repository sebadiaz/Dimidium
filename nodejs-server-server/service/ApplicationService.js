
'use strict';
var DimAppice = require('../kubernetes/client/DimAppService');
var Namespace = require('../kubernetes/client/NamespaceService');
var Service = require('../kubernetes/client/ServicesService');

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
      services[i]['releasename']=releasename;
      Helm.installRelease(helmName,version,namespace,releasename);

  }
  DimAppice.create(workspace,namespace,services);
    
  return namespace;
}
const deleteDimObj = function(body) {
    var str = JSON.stringify(body);
    console.log('body dim %s %s',str , body);
    var list=body['spec']['components']['items'];
    var namespace=body['metadata']['labels']['namespace'];
    var arrayLength = list.length;
    for (var i = 0; i < arrayLength; i++) {
        var releasename=list[i]['releasename'];
        console.log('DELETE    %s ',releasename);
        Helm.deleteRelease(releasename);
    }
    Namespace.deleteNamespace(namespace);
    DimAppice.delete(namespace);
}
exports.deleteApp = function(body) {
    
    var str = JSON.stringify(body);
    console.log('body %s %s',str , body);
    var appId = body['appId'].value;
    console.log('appId %s',appId);
    //Create service
    //Namespace.createNamespace(namespace,workspace);
    //get Dim Object
    var objTodelete=DimAppice.get(appId,deleteDimObj);
    var str = JSON.stringify(objTodelete);
    console.log('objTodelete %s %s',str , objTodelete);
    //Create service
    //Namespace.deleteNamespace(namespace);
    return appId;
  }

  const getMergedDimObj = function(body,res) {
    var str = JSON.stringify(body);
    console.log('getMergedDimObj    %s %s',str , body);
    var items = body['items'];
    var result = res.body;

    res['res'].end(JSON.stringify(res['body']));
    var arrayLength = items.length;
    for (var i = 0; i < arrayLength; i++) {
          var name=items[i]['metadata']['name'];
          var labels=items[i]['metadata']['labels'];
          var release=undefined;
          if (labels&&items[i]['status']['loadBalancer']){
            console.log('has Label');
            var release=labels['release'];
            if(labels['linkname']){
                name=labels['linkname'];
            }
            console.log('has Label '+result['services'].length);
            console.log('has Label '+release);
            var arrayLengthSec = result['services'].length;
            for (var j = 0; j < arrayLengthSec; j++) {
                console.log('has Label "'+result['services'][j]['id']+'"=="'+release+'" '+(result['services'][j]['id']==release));
                if(result['services'][j]['id']==release){
                    console.log('has ingress '+items[i]['status']['loadBalancer']["ingress"]);
                    if(!result['services'][j]['urls']){
                        console.log('create urls ');
                        result['services'][j].push({urls:[]});
                    }
                   
                    if(items[i]['status']['loadBalancer']["ingress"])
                    {
                        var arrayLengthThird = items[i]['status']['loadBalancer']["ingress"].length;
                        for (var k = 0; k < arrayLengthThird; k++) {
                            var arrayLengthFourth = items[i]['spec']['ports'].length;
                            for (var l = 0; l < arrayLengthFourth; l++) {
                                if(items[i]['spec']['ports'][l]['nodePort']){
                                    result['services'][j]['urls'].push({name:name,'url':items[i]['status']['loadBalancer']["ingress"][k]['ip']+":"+items[i]['spec']['ports'][l]['nodePort']});
                                }
                            }
                        }
                    }
                }
            }
          }
    }
    res['res'].end(JSON.stringify(result));
  }

  const getDimObj = function(body,res) {
      var response=
      {
        "id": body['metadata']['name'],
        "worspace": body['metadata']['labels']['workspace'],
        "name": body['metadata']['name'],
        "services": [
          
        ]
      };
      var items=body['spec']['components']['items'];
      var arrayLength = items.length;
      for (var i = 0; i < arrayLength; i++) {
          var releasename=items[i]['releasename'];
          var helmname=items[i]['helmname'];
          var helmversion=items[i]['helmversion'];
          if(helmversion){
            response["services"].push({id:releasename,name:helmname,version:helmversion});
          }else{
            response["services"].push({id:releasename,name:helmname});
          }
         
      }

      var result={res:res,body:response};
      console.log('getDimObj    %s',result);
      Service.getServices(body['metadata']['name'],getMergedDimObj,result);
     //res.end(JSON.stringify(response));
    }

  exports.getApp = function(body,res) {
    
    var str = JSON.stringify(body);
    console.log('body %s %s',str , body);
    var appId = body['appId'].value;
    console.log('appId %s',appId);
    DimAppice.get(appId,getDimObj,res);
    
  }

  