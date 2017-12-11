
'use strict';
var Fs = require('fs');
var File = require('../tools/LoadFile');
var Config = require('../tools/Config');
var Helm = require('../kubernetes/helm/HelmService');
var Yaml1 = require('js-yaml');
var MongoDBService=require('../store/MongoDBService');

function print(err, result) {
  console.log(JSON.stringify(err || result, null, 2));
}


const getTemp= function () {
  var path = "/tmp";
  if(process.argv.indexOf("--temppath") != -1){ //does our flag exist?
    path = process.argv[process.argv.indexOf("--temppath") + 1]; //grab the next item
  }

  return path;
}



  exports.listService = function(body,res) {
    
    var str = JSON.stringify(body);
    console.log('body %s %s',str , body);

    MongoDBService.listDocuments('helmrepo',function(err,result){
      if(err){
        res.statusCode=500;
        res.end(err);
        return;
      }
      for (var resulUni in result) {
        delete result[resulUni]._id;
      }
      res.end(JSON.stringify(result));
      
    });
    //
    //var fs = require("fs");
    //var fileName = "static/services.json";
    //File.loadFile(fileName,data=>{res.end(data);},()=>{res.end();})

   
    
  };

  exports.deleteService = function(body,res) {
    var str = JSON.stringify(body);
    console.log('body %s %s',str , body);
    var id = body['id'].value;
    MongoDBService.deleteDocument('helmrepo',{id:id},function(err,result){
      if(err){
        res.statusCode=500;
        res.end(err);
        return;
      }
    
      res.end();});
    
      
    
    //File.loadFile(fileName,data=>{res.end(data);},()=>{res.end();})
   
    
  };

 

exports.uploadService = function(body,res) {
  console.log('body %s %s', body);
  var file = body.upfile.originalValue.originalname;
  var buffer = body.upfile.originalValue.buffer;
  var categoryName = body['categoryName'].value;
  console.log('file %s categoryName %s buffer %s', file,categoryName);
  var str = JSON.stringify(body);
    
  var indexPath=getTemp()+"/dimidium-"+Math.floor(Math.random() * 1000000000);
  Fs.mkdirSync(indexPath);
  var chartsPath=indexPath+"/charts";
  Fs.mkdirSync(chartsPath);

  Fs.writeFileSync(chartsPath+"/"+file, buffer);
  console.log("The file was saved! %s.",chartsPath+"/"+file);
  Helm.repoIndex(chartsPath,categoryName);
  var fileName = chartsPath+"/index.yaml";
  var brutYaml=File.loadFileSync(fileName);
  var transformed=Yaml1.safeLoad(brutYaml);
  for (var key in transformed['entries']) {
    var principalnode=transformed['entries'][key];
    var id=(categoryName+"_"+principalnode[0]['name']+"-"+principalnode[0]['version']);
    principalnode[0].id=id;
    principalnode[0].category=(categoryName);
    principalnode[0].originalname=principalnode[0].name;
    principalnode[0].name=categoryName+"/"+principalnode[0].name;
    principalnode[0].filename=categoryName+'_'+fileName;

    MongoDBService.listDocuments('helmrepo',function(err,result){
      var found=false;
      for (var resulUni in result) {
        console.log('Config exists ',result[resulUni].id );
        console.log('Config exists ',result[resulUni].id );
        if(id==result[resulUni].id){
          console.log('Config exists ',id );
          res.statusCode=409;
          res.end('Chart '+id+' exists !')
          return ;
        }
      }
      console.log('Save config  ',principalnode[0].id );
      MongoDBService.pushDocument('helmrepo',principalnode[0],print);
      MongoDBService.pushStream(categoryName+'_'+fileName,Fs.createReadStream(chartsPath+"/"+file),print);
      res.end('Chart '+id+' saved !');
    });
    

  }
  

};



  