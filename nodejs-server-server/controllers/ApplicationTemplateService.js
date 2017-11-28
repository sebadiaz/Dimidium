'use strict';

exports.listApp = function(args, res, next) {
  /**
   * Retrieve the applications templates
   * Should include 
   *
   * returns List
   **/
  var examples = {};
  examples['application/json'] = [ {
  "name" : "Trainer Trading",
  "id" : "Application id",
  "services" : [ {
    "name" : "reporting",
    "version" : "aeiou"
  } ]
} ];
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

