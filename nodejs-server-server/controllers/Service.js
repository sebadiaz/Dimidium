'use strict';

var url = require('url');

var Service = require('./ServiceService');

module.exports.listService = function listService (req, res, next) {
  Service.listService(req.swagger.params, res, next);
};
