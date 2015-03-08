/*jshint node:true */
'use strict';
var q = require('q');
var _ = require('lodash');

var r = require('../../db');
var respond = require('../response-handler').responseHandler;

var trainController = function (req, res) {
  _.extend(res.locals.parameters, req.params);
  var params = res.locals.parameters;
  return q()
    .then(function () {
      if (params.number === undefined && params.id === undefined) {
        throw new Error('Not enough parameters specified');
      }
      return r.table('trains');
    })
    .then(function (query) {
      if (params.number !== undefined) return query.getAll(+params.number, {'index': 'number'})(0);
      if (params.id !== undefined) return query.get(params.id);
    })
    .then(respond.bind(null, res))
    .catch(respond.bind(null, res));
};

module.exports = trainController;