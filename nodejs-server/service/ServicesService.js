
'use strict';

var File = require('../tools/LoadFile');
  exports.listService = function(body,res) {
    
    var str = JSON.stringify(body);
    console.log('body %s %s',str , body);

    var fs = require("fs");
    var fileName = "static/services.json";
    File.loadFile(fileName,data=>{res.end(data);},()=>{res.end();})
   
    
  }
  

  