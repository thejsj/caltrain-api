/*jshint node:true */
'use strict';
var q = require('q');
var moment = require('moment');
var r = require('../../db');
var respond = require('../response-handler').responseHandler;
var arrayToObject = require('../array-to-object');

var getWeekday = function (moment) {
  var day = moment.format('dddd');
  if (day === 'sunday' || day === 'saturday') return day;
  return 'weekday';
};

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
      return [query, moment()];
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
      return [query, departureTime, arrivalTime];
    })
    .spread(respond.bind(null, res));
};

module.exports = trainSearchController;