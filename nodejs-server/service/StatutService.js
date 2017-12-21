
'use strict';
var DimAppice = require('../kubernetes/client/DimAppService');
var Namespace = require('../kubernetes/client/NamespaceService');
var Deployment = require('../kubernetes/client/DeploymentService');
var ConfigMap = require('../kubernetes/client/ConfigMapService');
var Service = require('../kubernetes/client/ServicesService');
var Ingress = require('../kubernetes/client/IngressService');
var File = require('../tools/LoadFile');
var Helm = require('../kubernetes/helm/HelmService');
var UpdateDNSJob = require('../jobs/UpdateDNSJob');
var Config = require('../tools/Config');

/**
 * Add a new pet to the store
 * 
 *
 * body Pet Pet object that needs to be added to the store
 * no response value expected for this operation
 **/



exports.mergeIngresses = function(body,options,fn) {
    console.log('mergeIngresses');
    var result = options.response;
    var namespace=options.namespace;
    var str = JSON.stringify(body);
    if (Config.isDebug())
        console.log('body deeeeee %s %s',str , body);
    try {  
    var items = body['items'];
    var arrayLength = items.length;

    for (var i = 0; i < arrayLength; i++) {
          var name=items[i]['metadata']['name'];
          var creationTimestamp=items[i]['metadata']['creationTimestamp'];
          var namespace=items[i]['metadata']['namespace'];
          var labels=items[i]['labels'];
          var spec=items[i]['spec'];
          var status=items[i]['status'];
          var type="http";
          if(labels&&labels['type']){
              type=labels['type'];
          }
          var rules=spec['rules'];
          var arrayrules = rules.length;
          for (var j = 0; j < arrayrules; j++) {
            var host=rules[j]['host'];
            if(!result['urls']){
                result['urls']=[];
            }
            result['urls'].push({creationTimestamp:creationTimestamp,name:name,'url':host,'type':type});
          }


    }
  } catch (e) {
    console.error(e);
  }
  options.response=result;
  console.log('mergeIngresses next');
  fn(options.namespace,options,options.fns.shift());

  
}


exports.mergeWithDeployements = function(res,option){
    var str = JSON.stringify(res);
    if (Config.isDebug())
        console.log('body res %s %s',str , res);
    
    var resultin=option['result'];
     if (!resultin['status']){
        resultin['status']={};
     }
     if (!resultin['status']['components']){
        resultin['status']['components']={};
    }
    resultin['status']['components']['deployments']=res;
    option['res'].end(JSON.stringify(resultin));

 }

 exports.mergeService = function(body,options,fn){
    var str = JSON.stringify(body);
    if (Config.isDebug())
        console.log('body dim %s %s',str , body);
    var items = body['items'];
    var result = options.response;
    var namespace = undefined;
    var arrayLength = items.length;
    for (var i = 0; i < arrayLength; i++) {
          var name=items[i]['metadata']['name'];
          var labels=items[i]['metadata']['labels'];
          var annotations=items[i]['metadata']['annotations'];
          namespace=items[i]['metadata']['namespace'];
          var release=undefined;
          if (labels&&items[i]['status']['loadBalancer']&&items[i]['spec']['type']=="LoadBalancer"){

            var release=labels['release'];
            if(labels['linkname']){
                name=labels['linkname'];
            }
            if(!result['urls']){
             
                result['urls']=[];
            }
            var arrayLengthFourth = items[i]['spec']['ports'].length;
            for (var l = 0; l < arrayLengthFourth; l++) {
                if(items[i]['spec']['ports'][l]['port']){
                    var port=items[i]['spec']['ports'][l]['port'];
                    var namedns=undefined;
                    var nameCon=items[i]['spec']['ports'][l]['name'];
                    if(annotations){
                        namedns=annotations['external-dns.alpha.kubernetes.io/hostname'];
                    }
                    var urlFinal=namedns+":"+port;
                    if(items[i]['status']['loadBalancer']["ingress"])
                    {
                        var arrayLengthThird = items[i]['status']['loadBalancer']["ingress"].length;
                        for (var k = 0; k < arrayLengthThird; k++) {
                            
                            var ip=items[i]['status']['loadBalancer']["ingress"][k]['ip'];
                            if(!namedns){
                                urlFinal=ip+":"+port;
                            }
                            
                            result['urls'].push({creationTimestamp:items[i]['metadata']['creationTimestamp'],ip:ip,name:name,'url':urlFinal,'portname':nameCon,port:port});
                                
                        }
                    }
                    else{
                        if(namedns){
                            result['urls'].push({creationTimestamp:items[i]['metadata']['creationTimestamp'],ip:'pending',name:name,'url':urlFinal,'portname':nameCon,port:port});
                        }else{
                            result['urls'].push({creationTimestamp:items[i]['metadata']['creationTimestamp'],ip:'pending',name:name,'url':'pending','portname':nameCon,port:port});
                        }
                    }
                }
            }
           
          }
    }
    options.response=result;
    fn(options.namespace,options,options.fns.shift());
    //Ingress.getIngresses(res.original['metadata']['name'],getMergedIngressesObj,res);
 }



 exports.constructDimObj = function(body) {
    var response=
    {
      "id": body['metadata']['name'],
      "workspace": body['metadata']['labels']['workspace'],
      "name": body['metadata']['name'],
      "status":body['status'],
      "services": [
        
      ]
    };
    if (Config.isDebug())
        console.log('constructDimObj    %s',response);
    var items=body['spec']['components']['items'];
    var arrayLength = items.length;
    for (var i = 0; i < arrayLength; i++) {
        console.log('releasename %s',items[i]['releasename']);
        var releasename=items[i]['releasename'];
        var helmname=items[i]['helmname'];
        var deployname=items[i]['deployname'];
        if(deployname){
            deployname=deployname.toLowerCase();
        }
        var helmversion=items[i]['helmversion'];
        if(helmversion){
          response["services"].push({id:releasename,deployname:deployname,name:helmname,version:helmversion});
        }else{
          response["services"].push({id:releasename,deployname:deployname,name:helmname});
        }
       
    }
    return response;
  }

  exports.mergeDimExtra = function(body,options,fn){
    console.log('Call mergeDimExtra');
    var str = JSON.stringify(body);
    if(body['code']){
        options.res.statusCode=body['code'];
        options.res.end();
        return;
    }

    if (Config.isDebug())
        console.log('getDimObj    %s %s',str , body);
    var response=constructDimObj(body);
    options.response=response;
    options.namespace=body['metadata']['labels']['namespace']
    //var result={res:res,body:response,original:body};
    console.log('Call mergeDimExtra next');
    var nextFunc=options.fns.shift();
    console.log('Call mergeDimExtra next'+fn);
    console.log('Call mergeDimExtra next'+nextFunc);
    try{
        fn(options.namespace,options,nextFunc);
    } catch (e) {
        console.error(e);
    }
  }

  const mergeWithStatus = function(name,body,options,fn){
    var str = JSON.stringify(body);
    if (Config.isDebug())
        console.log('body res %s %s',str , body);
    
    var resultin=options.response;
     if (!resultin['status']){
        resultin['status']={};
     }
     if (!resultin['status']['components']){
        resultin['status']['components']={};
    }
    resultin['status']['components'][name]=body;
    var nextFunc=options.fns.shift();
    fn(options.namespace,options,nextFunc);

 }

  exports.mergeWithStatusDeployments = function(body,options,fn){
    mergeWithStatus('deployments',body,options,fn);

 }

 exports.mergeWithStatusPod = function(body,options,fn){
    mergeWithStatus('pods',body,options,fn);

 }
 exports.mergeWithStatusService = function(body,options,fn){
    mergeWithStatus('services',body,options,fn);

 }

 

  

  

  