/*jshint node:true */
'use strict';
var responseHandler = require('../response-handler').responseHandler;
var errorHandler = require('../response-handler').errorHandler;
var q = require('q');

var trainController = function (req, res) {
  return q()
    .then(responseHandler.bind(null, res))
    .catch(errorHandler);
};

module.exports = trainController;