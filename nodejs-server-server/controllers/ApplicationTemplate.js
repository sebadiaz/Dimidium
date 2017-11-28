'use strict';

var url = require('url');

var ApplicationTemplate = require('./ApplicationTemplateService');

module.exports.listApp = function listApp (req, res, next) {
  ApplicationTemplate.listApp(req.swagger.params, res, next);
};
