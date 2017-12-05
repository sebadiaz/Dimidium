
'use strict';
var DimAppice = require('../kubernetes/client/DimAppService');
var Namespace = require('../kubernetes/client/NamespaceService');
var ConfigMap = require('../kubernetes/client/ConfigMapService');
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
    //Create configMap
    ConfigMap.createConfigMap(namespace,workspace,'dimidium-links');
    var base_url="default";
    if(process.argv.indexOf("--base-url") != -1){ //does our flag exist?
        base_url = process.argv[process.argv.indexOf("--base-url") + 1]; //grab the next item
    }
    ConfigMap.patchConfigMap('dimidium-links',namespace,"DIMIDIUM_START_DATE",new Date().toISOString());
    ConfigMap.patchConfigMap('dimidium-links',namespace,"DIMIDIUM_BASE_URL",base_url);
    ConfigMap.patchConfigMap('dimidium-links',namespace,"DIMIDIUM_WORKSPACE",workspace);
    ConfigMap.patchConfigMap('dimidium-links',namespace,"DIMIDIUM_APP_NAME",name);
    ConfigMap.patchConfigMap('dimidium-links',namespace,"DIMIDIUM_NAMESPACE",namespace);
    ConfigMap.patchConfigMap('dimidium-links',namespace,"DIMIDIUM_APP_BASE_URL",name+"-"+workspace+"-"+base_url);
    //Install Service
    var arrayLength = services.length;
    for (var i = 0; i < arrayLength; i++) {
        var helmName=services[i]['name'];
        var version=services[i]['version'];
        var deployname = services[i]['deployname'];
        if(!deployname){
            deployname=helmName;
        }
        var releasename=namespace+"-"+deployname.replace('/', '-');
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
    //delete configMap
    ConfigMap.delete('dimidium-links',namespace);
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
          var annotations=items[i]['metadata']['annotations'];
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
                    var namedns="";
                    if(annotations){
                        namedns=annotations['external-dns.alpha.kubernetes.io/hostname'];
                    }
                    for (var l = 0; l < arrayLengthFourth; l++) {
                        if(items[i]['spec']['ports'][l]['port']){
                            var port=items[i]['spec']['ports'][l]['port'];
                            var urlFinal=ip+":"+port;
                            if(namedns){
                                urlFinal=namedns+":"+port;
                            }
                            var nameCon=items[i]['spec']['ports'][l]['name'];
                            result['urls'].push({name:name,'url':urlFinal,'portname':nameCon,port:port,ip:ip});
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
      "workspace": body['metadata']['labels']['workspace'],
      "name": body['metadata']['name'],
      "services": [
        
      ]
    };
    var items=body['spec']['components']['items'];
    var arrayLength = items.length;
    for (var i = 0; i < arrayLength; i++) {
        var releasename=items[i]['releasename'];
        var helmname=items[i]['helmname'];
        var deployname=items[i]['deployname'];
        var helmversion=items[i]['helmversion'];
        if(helmversion){
          response["services"].push({id:releasename,deployname:deployname,name:helmname,version:helmversion});
        }else{
          response["services"].push({id:releasename,deployname:deployname,name:helmname});
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

  const pushHelm = function(body,res) {
    var str = JSON.stringify(body);
    console.log('pushHelm %s %s',str , body);
    if(body['code']){
        res['res'].statusCode=body['code'];
        res['res'].end();
        return;
    }
    var appname=body['metadata']['name'];
    var workspace=body['metadata']['labels']['workspace'];
    var namespace=body['metadata']['labels']['namespace'];
    console.log('pushHelm %s %s',str , body);
    var helmname=res['name'];
    var deployname=res['deployname'];
    var version=res['version'];
    console.log('pushHelm %s %s %s %s %s %s',appname , workspace,namespace,helmname,deployname,version);
    if(!deployname){
        deployname=helmname;
    }
    var releasename=namespace+"-"+deployname.replace('/', '-');
    //add helm
    Helm.installRelease(helmname,version,namespace,releasename);

    //update DiminiumApp
    if(!body['spec']['components']['items']){
        body['spec']['components']['items']=[];
    }
    body['spec']['components']['items'].push({helmname:helmname,deployname:deployname,helmversion:version,releasename:releasename});
    var newBody={spec:{components:{items:[{helmname:helmname,deployname:deployname,helmversion:version,releasename:releasename}]}}};
    
   // DimAppice.delete(appname);
    //DimAppice.delete(appname);
    str = JSON.stringify(newBody);
    console.log('pushHelm %s %s',str , newBody);
    DimAppice.update(appname,body);
  }
  
  exports.addServiceApp = function(body,res) {
    
    var str = JSON.stringify(body);
    console.log('body %s %s',str , body);
    var appId = body['appId'].value;
    var resour=[];
    resour['name'] = body['service']['value']['name'];
    resour['deployname'] = body['service']['value']['deployname'];
    resour['version'] = body['service']['value']['version'];
    resour['res']=res;
    //Load dim
    DimAppice.get(appId,pushHelm,resour);
    //add helm
  

    
  }

  

  