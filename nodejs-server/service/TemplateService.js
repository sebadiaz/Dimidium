
'use strict';
var ObjectID = require('mongodb').ObjectID;
var File = require('../tools/LoadFile');
var MongoDBService = require('../store/MongoDBService');

  exports.listTemplate = function(body,res) {
    
    var str = JSON.stringify(body);
    
    var fs = require("fs");
    var fileName = "static/templates.json";
    //File.loadFile(fileName,data=>{res.end(data);},()=>{res.end();})
    MongoDBService.listDocuments('templates', function (err, result) {
      if(err){
        res.statusCode = 500;
        console.log(JSON.stringify(err));
        res.end(JSON.stringify(err));
        return;
      }
      res.end(JSON.stringify(result));
    });
   
    
  }

  exports.preloadTemplate = function() {
    var fileName = "static/templates.json";
    MongoDBService.listDocuments('templates', function (err, result) {
      if(err){
        res.statusCode = 500;
        console.log(JSON.stringify(err));
        res.end(JSON.stringify(err));
        return;
      }
      File.loadFile(fileName,data=>{
        var parsed = JSON.parse(data);
        for (var resulUni in parsed) {
          var name=parsed[resulUni]['name'];
          var notfound=true;
          for (var exRes in result) {
              if (name == result[exRes]['name']){
                notfound=false;
                break;
              }
          }
          //MongoDBService.deleteDocument('templates', { name: name },function (err, result) { if(err){   console.log(JSON.stringify(err)); }  });    
          if(notfound){
            
            MongoDBService.pushDocument('templates', parsed[resulUni],function (err, result) { if(err){   console.log(JSON.stringify(err)); }  });    
          }
    
        }
      
      },()=>{})  
    });
    
    
   
    
  }
  

  