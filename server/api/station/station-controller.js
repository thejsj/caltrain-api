/*jshint node:true */
'use strict';
var sendResponse = require('../send-response');
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
          .then(function (result) {
            sendResponse(res, result);
          });
      }
      if (params.slug !== undefined) {
        return r
          .table('stations')
          .getAll(params.slug, {'index': 'slug'})(0)
          .run(r.conn)
          .then(function (result) {
            sendResponse(res, result);
          });
      }
      throw new Error('Not enough parameters specified');
    })
    .catch(function (err) {
      console.log('ERROR', err);
      sendResponse(res, {});
    });
};

module.exports = stationController;