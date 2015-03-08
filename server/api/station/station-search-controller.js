/*jshint node:true */
'use strict';
var q = require('q');

var isLongitude = require('../../utils').isLongitude;
var isLatitude = require('../../utils').isLatitude;

var r = require('../../db');
var respond = require('../response-handler').responseHandler;

var stationSearchController = function (req, res) {
  var params = res.locals.parameters;
  return q()
    .then(function () {
      if (params.name === undefined && (params.longitude === undefined && params.latitude === undefined)) {
        throw new Error('Not enough parameters specified');
      }
      return r.table('stations');
    })
    .then(function (query) {
      if (params.name !== undefined) {
        return query
          .filter(function (row) {
            return r.expr(row('slug').match(params.name.toLowerCase()))
              .or(row('name').downcase().match(params.name.toLowerCase()));
          });
      }
      return query;
    })
    .then(function (query) {
      if (params.latitude !== undefined && params.longitude !== undefined) {
        if (!isLatitude(params.latitude)) throw new Error('Latitude parameter is not a valid latitude');
        if (!isLongitude(params.longitude)) throw new Error('Longitude parameter is not a valid longitude');
        return query
          .merge(function (row) {
            return { 'distance':
              r.distance(row('location'), r.point(+params.longitude, +params.latitude))
            };
          })
          .orderBy(function (row) {
            return row('distance');
          });
      }
      return query;
    })
    .then(respond.bind(null, res))
    .catch(respond.bind(null, res));
};

module.exports = stationSearchController;