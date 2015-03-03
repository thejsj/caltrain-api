/*jshint node:true */
'use strict';
var responseHandler = require('../response-handler').responseHandler;
var errorHandler = require('../response-handler').errorHandler;
var toArray = require('../response-handler').toArray;
var q = require('q');
var r = require('../../db');

var queryTrains = function () {
  return r.table('trains');
};

var returnQuery = function (query, res) {
  return query
    .run(r.conn)
    .then(responseHandler.bind(null, res));
};

var trainController = function (req, res) {
  var params = res.locals.parameters;
  return q()
    .then(function () {
      if (params.number === undefined && params.id === undefined) {
        throw new Error('Not enough parameters specified');
      }
      var query = queryTrains();
      if (params.number !== undefined) {
        query = query.getAll(+params.number, {'index': 'number'})(0);
      }
      if (params.id !== undefined) {
        query = query.get(params.id);
      }
      return returnQuery(query, res);
    })
    .catch(errorHandler.bind(null, res));
};

module.exports = trainController;