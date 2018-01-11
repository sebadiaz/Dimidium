
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

};


exports.getOauthAuthUrl= function() {
  var secret="https://oauth.simple.api/authorization" ;
  if(process.env['DIMIDIUM_OAUTH_AUTH_URL']){
    return process.env['DIMIDIUM_OAUTH_AUTH_URL'];
  }
  return secret;

};
exports.getOauthTokenUrl= function() {
  var secret="https://oauth.simple.api/token" ;
  if(process.env['DIMIDIUM_OAUTH_TOKEN_URL']){
    return process.env['DIMIDIUM_OAUTH_TOKEN_URL'];
  }
  return secret;

};
exports.getOauthFlow= function() {
  var secret="accessCode" ;
  if(process.env['DIMIDIUM_OAUTH_FLOW']){
    return process.env['DIMIDIUM_OAUTH_FLOW'];
  }
  return secret;

};

exports.getJWTUserName= function() {
  var secret="unique_name" ;
  if(process.env['DIMIDIUM_JWT_PARAM_NAME']){
    return process.env['DIMIDIUM_JWT_PARAM_NAME'];
  }
  return secret;
};

exports.getMonoUrl = function() {
  var path = "http://localhost:8081";
  if(process.env['DIMIDIUM_MONOCULAR_URL']){
    path=process.env['DIMIDIUM_MONOCULAR_URL'];
  }
  if(process.argv.indexOf("--monocular-url") != -1){ //does our flag exist?
    path = process.argv[process.argv.indexOf("--monocular-url") + 1]; //grab the next item
  }

  return path;

};

exports.getDefaultWorkspace = function() {
  var workspace = "dimidium";
  if(process.env['DIMIDIUM_WORKSPACE_NAME']){
    workspace=process.env['DIMIDIUM_WORKSPACE_NAME'];
  }
  if(process.argv.indexOf("--worspace-name") != -1){ //does our flag exist?
    workspace = process.argv[process.argv.indexOf("--worspace-name") + 1]; //grab the next item
  }

  return workspace;

};

