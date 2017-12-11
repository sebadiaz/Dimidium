
exports.getHelmPath = function(fileName,callback,callBackNotFound) {
        var path = "charts";
        if(process.argv.indexOf("--helmpath") != -1){ //does our flag exist?
          path = process.argv[process.argv.indexOf("--helmpath") + 1]; //grab the next item
        }
      
        return path;
    
}

exports.getMongoDbUrl = function(fileName,callback,callBackNotFound) {
    var path = "mongodb://localhost:27017";
    if(process.argv.indexOf("--mongodburl") != -1){ //does our flag exist?
      path = process.argv[process.argv.indexOf("--mongodburl") + 1]; //grab the next item
    }
  
    return path;

}
exports.getMongoDbName = function(fileName,callback,callBackNotFound) {
    var path = "dimidium";
    if(process.argv.indexOf("--mongodbname") != -1){ //does our flag exist?
      path = process.argv[process.argv.indexOf("--mongodbname") + 1]; //grab the next item
    }
  
    return path;

}