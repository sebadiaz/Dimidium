
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

const deployByAnnotation= function () {
    var path = false;
    if(process.argv.indexOf("--annotation-dns") != -1){ //does our flag exist?
      return true;
    }
  
    return path;
  }

  const getKeys = function(name,namespace,workspace) {
    var base_url="default";
    if(process.argv.indexOf("--base-url") != -1){ //does our flag exist?
        base_url = process.argv[process.argv.indexOf("--base-url") + 1]; //grab the next item
        console.log('Use base url %s',base_url);
    }
    var cname_url="default";
    if(process.argv.indexOf("--cname-url") != -1){ //does our flag exist?
        cname_url = process.argv[process.argv.indexOf("--cname-url") + 1]; //grab the next item
        console.log('Use base url %s',base_url);
    }
    var dataMap={};
    dataMap["DIMIDIUM_START_DATE"]=new Date().toISOString();
    dataMap["DIMIDIUM_BASE_URL"]=base_url;
    dataMap["DIMIDIUM_WORKSPACE"]=workspace;
    dataMap["DIMIDIUM_APP_NAME"]=name;
    dataMap["DIMIDIUM_NAMESPACE"]=namespace;
    dataMap["DIMIDIUM_APP_BASE_URL"]=name+"-"+workspace+"."+base_url;
    dataMap["DIMIDIUM_CNAME_TARGET"]=cname_url;
    return dataMap;
    };


const transformMap = function(obj) { 
    var output=[];
    for (var K in obj)
    {
        var oin={};
        oin[K]=obj[oin];
        output.push(oin);
    }
    return output;
};

const joinStr = function(mapin,glue, separator) { 

    var output="";
    var first=true;
    for (var K in mapin)
    {
        if (!first){ output=output+separator;}
        output+=K+glue+mapin[K];
        first=false;
    }
    return output;
};

const createByHelm = function(namespace,deployname,err, resiult) {
    var deploysaved=deployname;
    var datenow=Date.now();
    DimAppice.get(namespace,function(resu,options){
        if(!resu.status){
            resu.status={helm:[]};
        }
        resu.status.helm.push({type:'install',date:datenow,deployname:deploysaved,error:err,result:resiult});
        DimAppice.update(namespace,resu);
        DimAppice.get(namespace,function(resu2,options2){
            if(!resu2.status){
                resu2.status={helm:[]};
            }
            var isFound=false;
            for( var id in resu2.status.helm){
                var act=resu2.status.helm[id];
                if(act.date==datenow && act.deployname==deploysaved){
                    isFound=true;
                }
            }
            if(!isFound){
                resu2.status.helm.push({type:'install',date:datenow,deployname:deploysaved,error:err,result:resiult});
                DimAppice.update(namespace,resu2);
            }
            

        },null);

    },null);

}

const createAppCompOnNS = function(name,namespace,workspace,services,res) {
    var dataMap=getKeys(name,namespace,workspace);
    
    //Install Service
    var arrayLength = services.length;
    var outputs=[];
    
    for (var i = 0; i < arrayLength; i++) {
        var helmName=services[i]['name'];
        var version=services[i]['version'];
        var deployname = helmName;
        if(services[i]['deployname']){
            deployname = services[i]['deployname'].toLowerCase();
        }
        var releasename=namespace+"-"+deployname.replace('/', '-');
        services[i]['releasename']=releasename;
        //push charts on local
  
    }

    DimAppice.create(workspace,namespace,services);

    for (var i = 0; i < arrayLength; i++) {
        var helmName=services[i]['name'];
        var version=services[i]['version'];
        var deployname = helmName;
        if(services[i]['deployname']){
            deployname = services[i]['deployname'].toLowerCase();
        }
        var releasename=namespace+"-"+deployname.replace('/', '-');
        services[i]['releasename']=releasename;
        var cloneOfdeployname = JSON.parse(JSON.stringify(deployname));
        var newKeys=services[i]['parameters'];
        if(newKeys){
            dataMap=Object.assign(dataMap, newKeys);
        }
        var keysSet=joinStr(dataMap,'=',',');//"DIMIDIUM_CNAME_TARGET="+cname_url+",DIMIDIUM_APP_BASE_URL="+dataMap["DIMIDIUM_APP_BASE_URL"]+",DIMIDIUM_WORKSPACE="+workspace+",DIMIDIUM_APP_NAME="+name+",DIMIDIUM_NAMESPACE="+namespace;
        //push charts on local
        Helm.installRelease(helmName,version,namespace,releasename,keysSet,(err, resiult)=>createByHelm(namespace,cloneOfdeployname,err,resiult));
       
  
    }
    // Follow Service creation and Add path on DNS when requested
    if(deployByAnnotation()){
        UpdateDNSJob.manageService(namespace,dataMap["DIMIDIUM_APP_BASE_URL"]);
    }
    
    res.end(JSON.stringify({id:namespace}));
    return namespace;
}

const createAppComp = function(name,workspace,services,res) {
    DimAppice.createDefinition();
    workspace=workspace.toLowerCase();
    name=name.toLowerCase();
    var namespace = workspace+"-"+name;
    namespace=namespace.toLowerCase();
    //Create service
    Namespace.createNamespace(namespace,workspace,function(err,result){
        console.log('Use err %s %s',err,result);
        if (err){
            res.statusCode=500;
            
            res.end("Application is terminating. Please wait.");
            return;
        }
        createAppCompOnNS(name,namespace,workspace,services,res);

    });
    //Create configMap
    
    
  };

exports.createApp = function(body,res) {
    var name = body['application']['value']['name'];
    var workspace = body['application']['value']['workspace'];
    var services = body['application']['value']['services'];
    var namespace=createAppComp(name,workspace,services,res);

  return namespace;
}
const deleteDimObj = function(body) {
    var str = JSON.stringify(body);
    if (Config.isDebug())
        console.log('body dim %s %s',str , body);
    var list=body['spec']['components']['items'];
    var namespace=body['metadata']['labels']['namespace'];
    var arrayLength = list.length;
    for (var i = 0; i < arrayLength; i++) {
        var releasename=list[i]['releasename'];
        console.log('DELETE    %s ',releasename);
        try{
            Helm.deleteRelease(releasename);
        } catch (e) {
        console.error(e);
      }
    }
    console.log('delete namespace %s',namespace);
    Namespace.deleteNamespace(namespace);
    //delete configMap
    console.log('delete ConfigMap %s',namespace);
    ConfigMap.deleteConfigMap('dimidium-links',namespace);
    console.log('delete DimAppice %s',namespace);
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


const getMergedIngressesObj = function(body,res) {
    var result = res.body;
    var namespace=res.namespace;
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
  if(namespace){
        Deployment.getDeployments(namespace,mergeWithDeployements,{result:result,res:res['res']} );
  }else{
        res['res'].end(JSON.stringify(result));
  }
}

const mergeWithDeployements = function(res,option){
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

const getMergedDimObj = function(body,res) {
    var str = JSON.stringify(body);
    if (Config.isDebug())
        console.log('body dim %s %s',str , body);
    var items = body['items'];
    var result = res.body;
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
    res['body']=result;
    res['namespace']=res.original['metadata']['name'];
    Ingress.getIngresses(res.original['metadata']['name'],getMergedIngressesObj,res);
    //res['res'].end(JSON.stringify(result));
  }

  const constructDimObj = function(body) {
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

  const getDimObj = function(body,res) {
    var str = JSON.stringify(body);
    if(body['code']){
        res.statusCode=body['code'];
        res.end();
        return;
    }

    if (Config.isDebug())
        console.log('getDimObj    %s %s',str , body);
    var response=constructDimObj(body);
    var result={res:res,body:response,original:body};
    if (Config.isDebug())
        console.log('getDimObj    %s',result);
    
    Service.getServices(body['metadata']['name'],getMergedDimObj,result);
  }

    const getDimObjs = function(body,res) {
        var str = JSON.stringify(body);
        if (Config.isDebug())
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
    if (Config.isDebug())
        console.log('body %s %s',str , body);
    var appId = body['appId'].value;
    var advanced = body['advanced'].value;
    if (Config.isDebug())
        console.log('appId %s',appId);

    var pipeline=[];
    //pipeline.push(Service.getServices,mergeWithServiceResult);
    //pipeline.push(Ingress.getIngresses,mergeWithIngressResult);
    //if(advanced &&advanced.toLowerCase()=='true'){
    //    pipeline.push(Deployment.getDeployments,mergeWithStatusResult);
    //    pipeline.push(Service.getServices,mergeWithStatusResult);
       // pipeline.push(Pod.getPods,mergeWithStatusResult);
    //}
    /*function a(next) {
  console.log('a');
  next();
}

function b(next) {
  console.log('b');
  next();
}

function c(next) {
  console.log('c');
  next();
}

function d(next) {
  console.log('d');
  next();
}


let fns = [a,b,c,d];

// chain function will call the supplied function
// and recursively call the chain function with the
// the next element in the array
function chain(fn) {
  if(fn) {
    fn(() => chain(fns.shift()));
  }
}

// start the chain with the first element in the array
chain(fns.shift());
*/
    DimAppice.get(appId,getDimObj,res);
    
  }

  exports.listApp = function(body,res) {
    
    var str = JSON.stringify(body);
    if (Config.isDebug())
        console.log('body %s %s',str , body);

    DimAppice.list(getDimObjs,res);
    
  }

  const loadTemplate = function(data,name,deployname,workspace,res) {
    var items=JSON.parse(data);
    if (Config.isDebug())
        console.log('loadTemplate %s',data );
    var arrayLength = items.length;
    var namespace=undefined;
    for (var i = 0; i < arrayLength; i++) {
        if(items[i]['name']==name){

            namespace=createAppComp(deployname.toLowerCase(),workspace,items[i]['services'],res);
        }
    }
    console.log('namespace %s',namespace );
    if(namespace){
        res.end(namespace);  
    }else{
        if (Config.isDebug())
            console.log('404 %s',namespace );
        res.statusCode=404;
        res.end()
        console.log('end %s',namespace );
    }
  }

  exports.createAppTemplate = function(body,res) {
    
    var str = JSON.stringify(body);
    if (Config.isDebug())
        console.log('body %s %s',str , body);
    var name = body['application']['value']['templatename'];
    var deployname = body['application']['value']['deployname'].toLowerCase();
    var workspace = body['application']['value']['workspace'];
    var fileName = "static/templates.json";
    File.loadFile(fileName,data=>{loadTemplate(data,name,deployname,workspace,res);},()=>{res.end();})
    
  }

  const pushHelm = function(body,res) {
    var str = JSON.stringify(body);
    if (Config.isDebug())
        console.log('pushHelm %s %s',str , body);
    if(body['code']){
        res['res'].statusCode=body['code'];
        res['res'].end();
        return;
    }
    var appname=body['metadata']['name'];
    var workspace=body['metadata']['labels']['workspace'];
    var namespace=body['metadata']['labels']['namespace'];
    if (Config.isDebug())
        console.log('pushHelm %s %s',str , body);
    var helmname=res['name'];
    var deployname=res['deployname'].toLowerCase();
    var version=res['version'];
    console.log('pushHelm %s %s %s %s %s %s',appname , workspace,namespace,helmname,deployname,version);
    if(!deployname){
        deployname=helmname;
    }
    var releasename=namespace+"-"+deployname.replace('/', '-');
    var dataMap=getKeys(appname,namespace,workspace);
    if(res['parameters']){
        dataMap=Object.assign(dataMap, res['parameters']);
    }
    
    var keysSet=joinStr(dataMap,'=',',');//"DIMIDIUM_CNAME_TARGET="+cname_url+",DIMIDIUM_APP_BASE_URL="+dataMap["DIMIDIUM_APP_BASE_URL"]+",DIMIDIUM_WORKSPACE="+workspace+",DIMIDIUM_APP_NAME="+name+",DIMIDIUM_NAMESPACE="+namespace;
    var datenow=Date.now();
    //push charts on local
    if(res['upgrade']){
        Helm.upgradeRelease(helmname,version,namespace,releasename,keysSet,function (err, resiult){
            DimAppice.get(namespace,function(resu,options){
                if(!resu.status){
                    resu.status={helm:[]};
                }
                resu.status.helm.push({type:'upgrade',date:datenow,deployname:deployname,error:err,result:resiult});
                DimAppice.update(namespace,resu);
    
            },null);
    
        });
    }else{
    //add helm
        Helm.installRelease(helmname,version,namespace,releasename,keysSet,function (err, resiult){
             var datenow=Date.now();
            DimAppice.get(namespace,function(resu,options){
                if(!resu.status){
                    resu.status={helm:[]};
                }
                resu.status.helm.push({type:'install',date:datenow,deployname:deployname,error:err,result:resiult});
                DimAppice.update(namespace,resu);

            },null);

        });
    }
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
    res['res'].end(appname);
  }
  
  exports.addServiceApp = function(body,res) {
    
    var str = JSON.stringify(body);
    console.log('body %s %s',str , body);
    var appId = body['appId'].value;
    var resour=[];
    resour['name'] = body['service']['value']['name'];
    resour['parameters'] = body['service']['value']['parameters'];
    resour['deployname'] = body['service']['value']['deployname'];

    if(resour['deployname']){
        resour['deployname']=resour['deployname'].toLowerCase();
    }
    resour['version'] = body['service']['value']['version'];
    resour['res']=res;
    //Load dim
    DimAppice.get(appId,pushHelm,resour);
    //add helm
  

    
  }

  exports.upgradeServiceApp = function(body,res) {
    
    var str = JSON.stringify(body);
    console.log('body %s %s',str , body);
    var appId = body['appId'].value;
    var serviceId = body['serviceId'].value;
    var resour=[];
    resour['name'] = body['service']['value']['name'];
    resour['parameters'] = body['service']['value']['parameters'];
    resour['deployname'] = body['service']['value']['deployname'];
    if(resour['deployname']){
        resour['deployname']=resour['deployname'].toLowerCase();
    }
    resour['version'] = body['service']['value']['version'];
    resour['res']=res;
    resour['upgrade']=true;
    //Load dim
    DimAppice.get(appId,pushHelm,resour);
    //add helm
  

    
  }

  

  