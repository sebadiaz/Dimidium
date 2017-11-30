
'use strict';
var DimAppice = require('../kubernetes/client/DimAppService');
var Namespace = require('../kubernetes/client/NamespaceService');
var Service = require('../kubernetes/client/ServicesService');
var File = require('../tools/LoadFile');
var Helm = require('../kubernetes/helm/HelmService');
/**
 * Add a new pet to the store
 * 
 *
 * body Pet Pet object that needs to be added to the store
 * no response value expected for this operation
 **/

const createAppComp = function(name,workspace,services) {
    DimAppice.createDefinition();
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

exports.createApp = function(body) {
    var name = body['application']['value']['name'];
    var workspace = body['application']['value']['workspace'];
    var services = body['application']['value']['services'];
    var namespace=createAppComp(name,workspace,services);
    /** 
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
    */
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
    var appId = body['appId'].value;
    //Create service
    //get Dim Object
    var objTodelete=DimAppice.get(appId,deleteDimObj);
    var str = JSON.stringify(objTodelete);
    //Create service
    return appId;
  }

  const getMergedDimObj = function(body,res) {
    var str = JSON.stringify(body);
    var items = body['items'];
    var result = res.body;

    var arrayLength = items.length;
    for (var i = 0; i < arrayLength; i++) {
          var name=items[i]['metadata']['name'];
          var labels=items[i]['metadata']['labels'];
          var release=undefined;
          if (labels&&items[i]['status']['loadBalancer']&&items[i]['spec']['type']=="LoadBalancer"){

            var release=labels['release'];
            if(labels['linkname']){
                name=labels['linkname'];
            }
            if(!result['urls']){
                result['urls']=[];
            }
            if(items[i]['status']['loadBalancer']["ingress"])
            {
                var arrayLengthThird = items[i]['status']['loadBalancer']["ingress"].length;
                for (var k = 0; k < arrayLengthThird; k++) {
                    var arrayLengthFourth = items[i]['spec']['ports'].length;
                    var ip=items[i]['status']['loadBalancer']["ingress"][k]['ip'];
                    for (var l = 0; l < arrayLengthFourth; l++) {
                        if(items[i]['spec']['ports'][l]['port']){
                            var urlFinal=ip+":"+items[i]['spec']['ports'][l]['port'];
                            var nameCon=items[i]['spec']['ports'][l]['name'];
                            result['urls'].push({name:name,'url':urlFinal,'portname':nameCon});
                        }
                    }
                }
            }else{
                result['urls'].push({name:'pending','url':'pending','portname':'pending'});
            }
           
          }
    }
    res['res'].end(JSON.stringify(result));
  }

  const constructDimObj = function(body) {
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
    return response;
  }

  const getDimObj = function(body,res) {
    var str = JSON.stringify(body);
    if(body['code']){
        res.statusCode=body['code'];
        res.end();
        return;
    }

    console.log('getDimObj    %s %s',str , body);
      var response=constructDimObj(body);
      var result={res:res,body:response};
      console.log('getDimObj    %s',result);
      Service.getServices(body['metadata']['name'],getMergedDimObj,result);
  }

    const getDimObjs = function(body,res) {
        var str = JSON.stringify(body);
        console.log('getDimObjs    %s %s',str , body);
        var items=body['items'];
        var arrayLength = items.length;
        var responses=[];
        for (var i = 0; i < arrayLength; i++) {
            responses.push(constructDimObj(items[i]));
        }

       res.end(JSON.stringify(responses));
      }
  

  exports.getApp = function(body,res) {
    
    var str = JSON.stringify(body);
    console.log('body %s %s',str , body);
    var appId = body['appId'].value;
    console.log('appId %s',appId);
    DimAppice.get(appId,getDimObj,res);
    
  }

  exports.listApp = function(body,res) {
    
    var str = JSON.stringify(body);
    console.log('body %s %s',str , body);

    DimAppice.list(getDimObjs,res);
    
  }

  const loadTemplate = function(data,name,deployname,workspace,res) {
    var items=JSON.parse(data);
    console.log('loadTemplate %s',data );
    var arrayLength = items.length;
    var namespace=undefined;
    for (var i = 0; i < arrayLength; i++) {
        if(items[i]['name']==name){

            namespace=createAppComp(name,workspace,items[i]['services']);
        }
    }
    console.log('namespace %s',namespace );
    if(namespace){
        res.end(namespace);  
    }else{
        console.log('404 %s',namespace );
        res.statusCode=404;
        res.end()
        console.log('end %s',namespace );
    }
  }

  exports.createAppTemplate = function(body,res) {
    
    var str = JSON.stringify(body);
    console.log('body %s %s',str , body);
    var name = body['application']['value']['templatename'];
    var deployname = body['application']['value']['deployname'];
    var workspace = body['application']['value']['workspace'];
    var fileName = "static/templates.json";
    File.loadFile(fileName,data=>{loadTemplate(data,name,deployname,workspace,res);},()=>{res.end();})
    
  }

  

  