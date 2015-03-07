/*jshint node:true */
'use strict';
var _ = require('lodash');
var q = require('q');

var r = require('../../db');
var respond = require('../response-handler').responseHandler;

var stationController = function (req, res) {
  _.extend(res.locals.parameters, req.params);
  var params = res.locals.parameters;
  return q()
    .then(function () {
      if (params.id === undefined && params.slug === undefined) {
        throw new Error('Not enough parameters specified');
      }
      return r.table('stations');
    })
    .then(function (query) {
      if (params.id !== undefined) return query.get(params.id);
      if (params.slug !== undefined) return query.getAll(params.slug, {'index': 'slug'})(0);
    })
    .then(respond.bind(null, res));
};

module.exports = stationController;