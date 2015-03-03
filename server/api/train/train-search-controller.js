/*jshint node:true */
'use strict';
var responseHandler = require('../response-handler').responseHandler;
var errorHandler = require('../response-handler').errorHandler;
var toArray = require('../response-handler').toArray;
var q = require('q');
var r = require('../../db');

var trainSearchController = function (req, res) {
  var params = res.locals.parameters;
  return q()
    .then(function () {
      if (params.from !== undefined && params.to !== undefined) {
        if (params.departure !== undefined) {

        }
      }
      if (params.from !== undefined) {

      }
      if (params.to !== undefined) {

      }
      throw new Error('Not enough parameters specified');
    })
    .catch(errorHandler.bind(null, res));
};

module.exports = trainSearchController;