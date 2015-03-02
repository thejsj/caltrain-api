/*jshint node:true */
'use strict';
var responseHandler = require('../response-handler').responseHandler;
var errorHandler = require('../response-handler').errorHandler;
var toArray = require('../response-handler').toArray;
var q = require('q');
var r = require('../../db');

var stationSearchController = function (req, res) {
  var params = res.locals.parameters;
  return q()
    .then(function () {
      if (params.name !== undefined) {
        return r
          .table('stations')
          .filter(function (row) {
            return r.expr(row('slug').match(params.name.toLowerCase()))
              .or(row('name').downcase().match(params.name.toLowerCase()));
          })
          .run(r.conn)
          .then(toArray)
          .then(responseHandler.bind(null, res));
      }
      throw new Error('Not enough parameters specified');
    })
    .catch(errorHandler);
};

module.exports = stationSearchController;