/*jshint node:true */
'use strict';
var responseHandler = require('../response-handler').responseHandler;
var errorHandler = require('../response-handler').errorHandler;
var toArray = require('../response-handler').toArray;
var q = require('q');
var r = require('../../db');

var trainController = function (req, res) {
  var params = res.locals.parameters;
  return q()
    .then(function () {
      if (params.number !== undefined) {
        return r.table('trains')
          .getAll(+params.number, {'index': 'number'})(0)
          .run(r.conn)
          .then(responseHandler.bind(null, res));
      }
      if (params.id !== undefined) {
        return r.table('trains')
          .get(params.id)
          .run(r.conn)
          .then(responseHandler.bind(null, res));
      }
      throw new Error('Not enough parameters specified');
    })
    .catch(errorHandler.bind(null, res));
};

module.exports = trainController;