
exports.getHelmPath = function() {
        var path = "charts";
        if(process.argv.indexOf("--helmpath") != -1){ //does our flag exist?
          path = process.argv[process.argv.indexOf("--helmpath") + 1]; //grab the next item
        }
      
        return path;
    
};

exports.getMongoDbUrl = function() {
    var path = "mongodb://localhost:27017";
    if(process.argv.indexOf("--mongodburl") != -1){ //does our flag exist?
      path = process.argv[process.argv.indexOf("--mongodburl") + 1]; //grab the next item
    }
  
    return path;

};
exports.getMongoDbName = function() {
    var path = "dimidium";
    if(process.argv.indexOf("--mongodbname") != -1){ //does our flag exist?
      path = process.argv[process.argv.indexOf("--mongodbname") + 1]; //grab the next item
    }
  
    return path;

};

exports.getRepoName = function() {
    var path = "dimidium";
    if(process.argv.indexOf("--reponame") != -1){ //does our flag exist?
      path = process.argv[process.argv.indexOf("--reponame") + 1]; //grab the next item
    }
  
    return path;

};

exports.getRepoUrl = function() {
    var path = "http://localhost:8080/v1/service/repo";
    if(process.argv.indexOf("--reponame") != -1){ //does our flag exist?
      path = process.argv[process.argv.indexOf("--reponame") + 1]; //grab the next item
    }
  
    return path;

};

exports.isDebug = function() {
  
  return (process.argv.indexOf("debug") != -1);

};