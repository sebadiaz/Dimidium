'use strict';

var Application = require('../service/ApplicationService');

exports.addServiceApp = function(args, res, next) {
  var id=Application.addServiceApp(args);
  res.end();
}

exports.createApp = function(args, res, next) {
  /**
   * Create an application
   * Should include 
   *
   * application ApplicationCreation The application to create. (optional)
   * no response value expected for this operation
   **/
  var id=Application.createApp(args);
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({id:id}));
  //res.end();
}

exports.createAppTemplate = function(args, res, next) {
  /**
   * Create an application
   * Should include 
   *
   * application ApplicationCreation The application to create. (optional)
   * no response value expected for this operation
   **/
  res.setHeader('Content-Type', 'application/json');
  Application.createAppTemplate(args,res);
  

  //res.end();
}


exports.deleteApp = function(args, res, next) {
  /**
   * Delete an application
   * 
   *
   * appId String ID of the app to update
   * no response value expected for this operation
   **/
  var id=Application.deleteApp(args);
  res.end();
}

exports.deleteAppService = function(args, res, next) {
  /**
   * Delete a service of an application
   * 
   *
   * appId String ID of the app to update
   * serviceId String ID of the app to update
   * no response value expected for this operation
   **/
  Application.deleteApp(args);
  res.end();
}

exports.getApp = function(args, res, next) {
  /**
   * Get an application.
   * 
   *
   * appId String ID of the app to update
   * returns ApplicationStatus
   **/
  res.setHeader('Content-Type', 'application/json');
  Application.getApp(args,res);
  /**var examples = {};
  examples['application/json'] = {
  "name" : "Trainer Trading",
  "id" : "Application id",
  "services" : [ "" ]
};
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
  */
}

exports.getAppServiceStatus = function(args, res, next) {
  /**
   * Get the deployment status of a service of an application
   * 
   *
   * appId String ID of the app to update
   * serviceId String ID of the app to update
   * returns ServiceStatus
   **/
  var examples = {};
  examples['application/json'] = "";
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.getAppServices = function(args, res, next) {
  /**
   * Get the services of an Application
   * 
   *
   * appId String ID of the app to update
   * returns List
   **/
  var examples = {};
  examples['application/json'] = [ "" ];
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.listApp = function(args, res, next) {
  /**
   * Retrieve the deployed applications
   * Should include 
   *
   * returns List
   **/
  res.setHeader('Content-Type', 'application/json');
  Application.listApp(args,res);
  /*
  var examples = {};
  examples['application/json'] = [ {
  "name" : "Trainer Trading",
  "id" : "Application id",
  "services" : [ "" ]
} ];
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }*/
}

exports.updateApp = function(args, res, next) {
  /**
   * Update an application
   * 
   *
   * appId String ID of the app to update
   * application ApplicationCreation The application to create. (optional)
   * no response value expected for this operation
   **/
  res.end();
}

