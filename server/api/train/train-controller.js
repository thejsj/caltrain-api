/*jshint node:true */
'use strict';
var sendResponse = require('../send-response');

var trainController = function (req, res) {
  return sendResponse(res, {});
};

module.exports = trainController;