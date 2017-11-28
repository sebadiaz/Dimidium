'use strict';

var url = require('url');

var Application = require('./ApplicationService');

module.exports.addServiceApp = function addServiceApp (req, res, next) {
  Application.addServiceApp(req.swagger.params, res, next);
};

module.exports.createApp = function createApp (req, res, next) {
  Application.createApp(req.swagger.params, res, next);
};

module.exports.deleteApp = function deleteApp (req, res, next) {
  Application.deleteApp(req.swagger.params, res, next);
};

module.exports.deleteAppService = function deleteAppService (req, res, next) {
  Application.deleteAppService(req.swagger.params, res, next);
};

module.exports.getApp = function getApp (req, res, next) {
  Application.getApp(req.swagger.params, res, next);
};

module.exports.getAppServiceStatus = function getAppServiceStatus (req, res, next) {
  Application.getAppServiceStatus(req.swagger.params, res, next);
};

module.exports.getAppServices = function getAppServices (req, res, next) {
  Application.getAppServices(req.swagger.params, res, next);
};

module.exports.listApp = function listApp (req, res, next) {
  Application.listApp(req.swagger.params, res, next);
};

module.exports.updateApp = function updateApp (req, res, next) {
  Application.updateApp(req.swagger.params, res, next);
};
