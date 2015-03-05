/*jshint node:true */
'use strict';
var q = require('q');
var moment = require('moment');
var r = require('../../db');
var respond = require('../response-handler').responseHandler;
var arrayToObject = require('../../utils').arrayToObject;
var getWeekday = require('../../utils').getWeekday;
var getSingleStationLocationIndexQuery = require('../../utils').getSingleStationLocationIndexQuery;

var trainSearchController = function (req, res) {
  var params = res.locals.parameters;
  return q()
    .then(function () {
      if (params.from === undefined && params.to === undefined) {
        throw new Error('Not enough parameters specified');
      }
      return r.table('trains');
    })
    .then(function (query) {
      if (params.departure !== undefined) return [query, moment(new Date(params.departure))];
      return [query, false];
    })
    .spread(function (query, departureTime) {
      if (params.arrival !== undefined) return [query, departureTime, moment(new Date(params.arrival))];
      return [query, departureTime, false];
    })
    .spread(function (query, departureTime, arrivalTime) {
      if (params.from !== undefined) {
        query = query.hasFields(arrayToObject('stations', getWeekday(departureTime), params.from, true));
      }
      if (params.to !== undefined) {
        query = query.hasFields(arrayToObject('stations', getWeekday(departureTime), params.to, true));
      }
      // Get by direction
      if (params.to !== undefined && params.from !== undefined) {
        return getSingleStationLocationIndexQuery(params.to)
          .gt(getSingleStationLocationIndexQuery(params.from))
          .run(r.conn)
          .then(function (isNorth) {
            query = query.filter({'direction': (isNorth ? 'north' : 'south')});
            return [query, departureTime, arrivalTime];
          });
      }
      return [query, departureTime, arrivalTime];
    })
    .spread(function (query, departureTime, arrivalTime) {
      // Query by arrivalTime and departureTime
      if (arrivalTime) {

      }
      if (departureTime) {
        query = query.
      }
      return [query, departureTime, arrivalTime];
    })
    .spread(respond.bind(null, res));
};

module.exports = trainSearchController;