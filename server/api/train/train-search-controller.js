/*jshint node:true */
'use strict';
var q = require('q');
var moment = require('moment');

var r = require('../../db');
var respond = require('../response-handler').responseHandler;
var arrayToObject = require('../../utils').arrayToObject;
var getWeekday = require('../../utils').getWeekday;
var getSingleStationLocationIndexQuery = require('../../utils').getSingleStationLocationIndexQuery;
var isDigits = new RegExp(/^([\d]*)$/);

var trainSearchController = (req, res) =>  {
  var params = res.locals.parameters;
  return q()
    .then(() =>  {
      return r.table('trains');
    })
    .then((query) =>  {
      if (params.arrival !== undefined) {
        return [query, moment(new Date(params.arrival))];
      }
      return [query, false];
    })
    .spread((query, arrivalTime) =>  {
      if (params.departure !== undefined) {
        if (isDigits.test(params.departure)) {
          params.departure = +params.departure;
        }
        return [query, moment(new Date(params.departure)), arrivalTime];
      }
      return [query, false, arrivalTime];
    })
    .spread((query, departureTime, arrivalTime) =>  {
      if (arrivalTime && departureTime) {
        if (arrivalTime.isBefore(departureTime)) {
          throw new Error('Incorrect Parameters: Arrival time occurs before departure time');
        }
        if (!arrivalTime.isSame(departureTime, 'day')) {
          throw new Error('Incorrect Parameters: Arrival time and departure time are not on the same date');
        }
      }
      if (arrivalTime && arrivalTime.isBefore('2000-01-01') && typeof params.arrival === 'number') {
        let m = `UNIX Timestamp provided for arrival is before 2000. `;
        m += `Are you sure you didn\'t forget the milliseconds (JavaScript UNIX Timestamps)?`;
        throw new Error(m);
      }
      if (departureTime && departureTime.isBefore('2000-01-01') && typeof params.departure === 'number') {
        let m = `UNIX Timestamp provided for departure is before 2000. `;
        m += `Are you sure you didn\'t forget the milliseconds (JavaScript UNIX Timestamps)?`;
        throw new Error(m);
      }
      if (arrivalTime && !arrivalTime.isSame(params.queryDay, 'day')) {
        throw new Error('Incorrect Parameters: Arrival time and query day are not on the same date');
      }
      if (departureTime && !departureTime.isSame(params.queryDay, 'day')) {
        throw new Error('Incorrect Parameters: Departure time and query day are not on the same date');
      }
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
          .then((isNorth) =>  {
            query = query.filter({'direction': (isNorth ? 'north' : 'south')});
            return [query, departureTime, arrivalTime];
          });
      }
      return [query, departureTime, arrivalTime];
    })
    .spread((query, departureTime, arrivalTime) =>  {
      // Query by arrivalTime and departureTime
      if (departureTime) {
        if (params.from === undefined) {
          throw new Error('Not enough parameters supplied. `departure` specified without a `from` station.');
        }
        var departureTimeInMinutes = (+departureTime.format('H')) * 60 + (+departureTime.format('m'));
        query = query
          .hasFields(arrayToObject('stations', getWeekday(departureTime), true))
          .filter(r.row('stations')(getWeekday(departureTime))(params.from).gt(departureTimeInMinutes));
      }
      if (arrivalTime) {
        if (params.to === undefined) {
          throw new Error('Not enough parameters supplied. `arrival` specified without a `to` station.');
        }
        var arrivalTimeInMinutes = (+arrivalTime.format('H')) * 60 + (+arrivalTime.format('m'));
        query = query
          .hasFields(arrayToObject('stations', getWeekday(arrivalTime), true))
          .filter(r.row('stations')(getWeekday(arrivalTime))(params.from).lt(arrivalTimeInMinutes));
      }
      return [query, departureTime, arrivalTime];
    })
    .spread((query, departureTime, arrivalTime) =>  {
      if (params.type !== undefined) {
        if (params.type.length === 1) {
          query = query
            .filter(r.row('type').eq(params.type[0]));
        }
        if (params.type.length === 2) {
          query = query
            .filter(r.row('type').eq(params.type[0]).or(r.row('type').eq(params.type[1])));
        }
        if (params.type.length > 2) throw new Error('Only two types allowed for type filter');
      }
      return [query, departureTime, arrivalTime];
    })
    .spread(respond.bind(null, res))
    .catch(respond.bind(null, res));
};

module.exports = trainSearchController;
