'use strict';

var Service = require('../service/ServicesService');

exports.listService = function(args, res, next) {
  /**
   * Retrieve the list of services with the description.
   * Should include 
   *
   * returns List
   *
  var examples = {};
  examples['application/json'] = [ "" ];
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
  */
  res.setHeader('Content-Type', 'application/json');
  Service.listService(args,res);
}

exports.uploadService = function(args, res, next) {
  /**
   * Retrieve the list of services with the description.
   * Should include 
   *
   * returns List
   *
  var examples = {};
  examples['application/json'] = [ "" ];
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
  */
  var str = JSON.stringify(args);
  //console.log('body %s %s',str , args);
  var file = args.upfile.originalValue;
  
    if (file.mimetype === -1) {
      debug('File not supported for upload');
      var err = {
        message: 'File type not supported for uploads'
      };
      return next(err);
    }

  Service.uploadService(args,res);
};

exports.downloadChart = function(args, res, next) {
  /**
   * Retrieve the list of services with the description.
   * Should include 
   *
   * returns List
   *
  var examples = {};
  examples['application/json'] = [ "" ];
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
  */
 
  res.setHeader('Content-Type', 'application/gzip');
  Service.downloadChart(args,res);
};

exports.deleteService = function(args, res, next) {
  Service.deleteService(args,res);
};

exports.downloadIndex = function(args, res, next) {
  res.setHeader('Content-Type', 'application/x-yaml');
  Service.downloadIndex(args,res);
};



