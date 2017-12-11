'use strict';

var url = require('url');

var Service = require('./ServiceService');

module.exports.listService = function listService (req, res, next) {
  Service.listService(req.swagger.params, res, next);
};

module.exports.uploadService = function uploadService (req, res, next) {
  Service.uploadService(req.swagger.params, res, next);
};

module.exports.deleteService = function uploadService (req, res, next) {
  Service.deleteService(req.swagger.params, res, next);
};

