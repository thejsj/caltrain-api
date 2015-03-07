/*jshint node:true */
'use strict';
var q = require('q');

var r = require('../../db');
var respond = require('../response-handler').responseHandler;

var stationSearchController = function (req, res) {
  var params = res.locals.parameters;
  return q()
    .then(function () {
      if (params.name === undefined) throw new Error('Not enough parameters specified');
      return r.table('stations');
    })
    .then(function (query) {
      return query
        .filter(function (row) {
          return r.expr(row('slug').match(params.name.toLowerCase()))
            .or(row('name').downcase().match(params.name.toLowerCase()));
        });
    })
    .then(respond.bind(null, res));
};

module.exports = stationSearchController;