
exports.getHelmPath = function() {
        var path = "charts";
        if(process.env['DIMIDIUM_HELM_PATH']){
          path=process.env['DIMIDIUM_HELM_PATH'];
        }
        if(process.argv.indexOf("--helmpath") != -1){ //does our flag exist?
          path = process.argv[process.argv.indexOf("--helmpath") + 1]; //grab the next item
        }
      
        return path;
    
};

exports.getMongoDbUrl = function() {
    var path = "mongodb://localhost:27017";
    if(process.env['DIMIDIUM_MONGODB_URL']){
      path=process.env['DIMIDIUM_MONGODB_URL'];
    }
    if(process.argv.indexOf("--mongodburl") != -1){ //does our flag exist?
      path = process.argv[process.argv.indexOf("--mongodburl") + 1]; //grab the next item
    }
  
    return path;

};
exports.getMongoDbName = function() {
    var path = "dimidium";
    if(process.env['DIMIDIUM_MONGODB_NAME']){
      path=process.env['DIMIDIUM_MONGODB_NAME'];
    }
    if(process.argv.indexOf("--mongodbname") != -1){ //does our flag exist?
      path = process.argv[process.argv.indexOf("--mongodbname") + 1]; //grab the next item
    }
  
    return path;

};

exports.getRepoName = function() {
    var path = "dimidium";
    if(process.env['DIMIDIUM_REPO_NAME']){
      path=process.env['DIMIDIUM_REPO_NAME'];
    }
    if(process.argv.indexOf("--reponame") != -1){ //does our flag exist?
      path = process.argv[process.argv.indexOf("--reponame") + 1]; //grab the next item
    }
  
    return path;

};

exports.getRepoUrl = function() {
    var path = "http://localhost:8080/v1/service/repo";
    if(process.env['DIMIDIUM_REPO_URL']){
      path=process.env['DIMIDIUM_REPO_URL'];
    }
    if(process.argv.indexOf("--reponame") != -1){ //does our flag exist?
      path = process.argv[process.argv.indexOf("--reponame") + 1]; //grab the next item
    }
  
    return path;

};

exports.isDebug = function() {
  
  return (process.argv.indexOf("debug") != -1);

};
exports.getJWTSecret = function() {
  var secret="secret" 
  if(process.env['DIMIDIUM_JWT_SECRET']){
    return process.env['DIMIDIUM_JWT_SECRET'];
  }
  return secret;

}
