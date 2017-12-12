'use strict';

var url = require('url');

var ApplicationTemplate = require('./ApplicationTemplateService');

module.exports.listTemp = function listTemp (req, res, next) {
  ApplicationTemplate.listTemp(req.swagger.params, res, next);
};
