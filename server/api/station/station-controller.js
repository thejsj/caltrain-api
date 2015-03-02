/*jshint node:true */
'use strict';
var responseHandler = require('../response-handler').responseHandler;
var errorHandler = require('../response-handler').errorHandler;
var q = require('q');
var r = require('../../db');

var stationController = function (req, res) {
  var params = res.locals.parameters;
  return q()
    .then(function () {
      if (params.id !== undefined) {
        return r
          .table('stations')
          .get(params.id)
          .run(r.conn)
          .then(responseHandler.bind(null, res));
      }
      if (params.slug !== undefined) {
        return r
          .table('stations')
          .getAll(params.slug, {'index': 'slug'})(0)
          .run(r.conn)
          .then(responseHandler.bind(null, res));
      }
      throw new Error('Not enough parameters specified');
    })
    .catch(errorHandler);
};

module.exports = stationController;