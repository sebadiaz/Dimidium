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

