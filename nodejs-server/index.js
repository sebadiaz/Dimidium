'use strict';

var fs = require('fs'),
    path = require('path'),
    http = require('http');

var app = require('connect')();
var passport = require('passport');
var swaggerTools = require('swagger-tools');
var jsyaml = require('js-yaml');
var serveStatic = require('serve-static')
var jwt = require('jsonwebtoken');
var serverPort = 8080;

// swaggerRouter configuration
var options = {
  swaggerUi: path.join(__dirname, '/swagger.json'),
  controllers: path.join(__dirname, './controllers'),
  useStubs: false
  //useStubs: process.env.NODE_ENV === 'development' // Conditionally turn on stubs (mock mode)
};



var myArgs = process.argv.slice(2);
console.log('myArgs: ', myArgs);

switch (myArgs[0]) {
  case 'debug':
    console.log( 'Debug mode.');
    require('request').debug = true
    break;
  default:
    
}




// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
var spec = fs.readFileSync(path.join(__dirname,'api/swagger.yaml'), 'utf8');
var swaggerDoc = jsyaml.safeLoad(spec);

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
  
  // gzip/deflate outgoing responses
  var compression = require('compression');
  app.use(compression());

  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  app.use(middleware.swaggerMetadata());

  // Validate Swagger requests
  app.use(middleware.swaggerValidator());

 

  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());

  app.use('/static',serveStatic(path.join(__dirname, 'views'), {'index': ['default.html', 'default.htm']}));
  //setup security
  try{
    app.use(middleware.swaggerSecurity({JWT: verifyToken}));
  } catch (e) {
    console.error(e);
  }
   // Route validated requests to appropriate controller
   app.use(middleware.swaggerRouter(options));
  // Start the server
  http.createServer(app).listen(serverPort, function () {
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
    console.log( 'Add repo on helm.');
    var HelmService=require("./kubernetes/helm/HelmService");
    HelmService.repoAdd();
  });

});



function verifyToken(req, authOrSecDef, token, callback) {
  console.log('Check secu ');
  //these are the scopes/roles defined for the current endpoint
  var currentScopes = req.swagger.operation["x-security-scopes"];
  
     function sendError() {
         return new Error('Access Denied');
     }
     console.log("tokk " +token );
     //validate the 'Authorization' header. it should have the following format:
     //'Bearer tokenString'
     if (token && token.indexOf("Bearer ") == 0) {
      console.log("tokk2 " +token );
         var tokenString = token.split(' ')[1];
         console.log("dede " +tokenString );
         jwt.verify(tokenString, 'secret', function (verificationError, decodedToken) {
          console.log("" +verificationError );
              console.log("" +decodedToken );
             //check if the JWT was verified correctly
             if (verificationError == null && Array.isArray(currentScopes) && decodedToken && decodedToken.role) {
                 // check if the role is valid for this endpoint
                 var roleMatch = currentScopes.indexOf(decodedToken.role) !== -1;
                 // check if the issuer matches
                 var issuerMatch = decodedToken.iss == issuer;
  
                 // you can add more verification checks for the
                 // token here if necessary, such as checking if
                 // the username belongs to an active user
  
                 if (roleMatch && issuerMatch) {
                     //add the token to the request so that we
                     //can access it in the endpoint code if necessary
                     req.auth = decodedToken;
                     //if there is no error, just return null in the callback
                     return callback(null);
                 } else {
                     //return the error in the callback if there is one
                     return callback(sendError());
                 }
  
             } else {
                 //return the error in the callback if the JWT was not verified
                 return callback(sendError());
             }
         });
     } else {
         //return the error in the callback if the Authorization header doesn't have the correct format
         return callback(sendError());
     }

}
