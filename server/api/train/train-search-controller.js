'use strict';
var q = require('q');
var moment = require('moment');

var r = require('../../db');
var respond = require('../response-handler').responseHandler;
var arrayToObject = require('../../utils').arrayToObject;
var getWeekday = require('../../utils').getWeekday;
var getSingleStationLocationIndexQuery = require('../../utils').getSingleStationLocationIndexQuery;
var isDigits = new RegExp(/^([\d]*)$/);
var errors = require('../errors');

var trainSearchController = (req, res) => {
  var params = res.locals.parameters;
  return q()
    .then(() => {
      return r.table('trains');
    })
    .then((query) => {
      if (params.arrival !== undefined) {
        return [query, moment(new Date(params.arrival))];
      }
      return [query, false];
    })
    .spread((query, arrivalTime) => {
      if (params.departure !== undefined) {
        if (isDigits.test(params.departure)) {
          params.departure = +params.departure;
        }
        return [query, moment(new Date(params.departure)), arrivalTime];
      }
      return [query, false, arrivalTime];
    })
    .spread((query, departureTime, arrivalTime) => {
      if (arrivalTime && departureTime) {
        if (arrivalTime.isBefore(departureTime)) {
          throw new errors.DepartureArrivalParameterValueError(
            arrivalTime.toISOString() + ' is before ' + departureTime.toISOString()
          );
        }
        if (!arrivalTime.isSame(departureTime, 'day')) {
          throw new errors.DepartureArrivalParameterValueError(
            arrivalTime.toISOString() + ' is not the same day as ' + departureTime.toISOString()
          );
        }
      }
      if (arrivalTime && arrivalTime.isBefore('2000-01-01') && typeof params.arrival === 'number') {
        throw new errors.UnixTimestampFormattingError();
      }
      if (departureTime && departureTime.isBefore('2000-01-01') && typeof params.departure === 'number') {
        throw new errors.UnixTimestampFormattingError();
      }
      if (arrivalTime && !arrivalTime.isSame(params.queryDay, 'day')) {
        let message = 'Arrival time (' + arrivalTime.toString() + ') is not in ';
        message += 'the same day as query day (' + params.queryDay + ')';
        throw new errors.ArrivalQueryDayParameterValueError(message);
      }
      if (departureTime && !departureTime.isSame(params.queryDay, 'day')) {
        let message = 'Departure time (' + departureTime.toString() + ') is not in ';
        message += 'the same day as query day (' + params.queryDay + ')';
        throw new errors.DepartureQueryDayParameterValueError(message);
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
          .then((isNorth) => {
            query = query.filter({'direction': (isNorth ? 'north' : 'south')});
            return [query, departureTime, arrivalTime];
          });
      }
      return [query, departureTime, arrivalTime];
    })
    .spread((query, departureTime, arrivalTime) => {
      // Query by arrivalTime and departureTime
      if (departureTime) {
        if (params.from === undefined) {
          throw new errors.DepartureFromNotEnoughParametersError();
        }
        var departureTimeInMinutes = (+departureTime.format('H')) * 60 + (+departureTime.format('m'));
        query = query
          .hasFields(arrayToObject('stations', getWeekday(departureTime), true))
          .filter(r.row('stations')(getWeekday(departureTime))(params.from).gt(departureTimeInMinutes));
      }
      if (arrivalTime) {
        if (params.to === undefined) {
          throw new errors.ArrivalToNotEnoughParametersError();
        }
        var arrivalTimeInMinutes = (+arrivalTime.format('H')) * 60 + (+arrivalTime.format('m'));
        query = query
          .hasFields(arrayToObject('stations', getWeekday(arrivalTime), true))
          .filter(r.row('stations')(getWeekday(arrivalTime))(params.from).lt(arrivalTimeInMinutes));
      }
      return [query, departureTime, arrivalTime];
    })
    .spread((query, departureTime, arrivalTime) => {
      if (params.type !== undefined) {
        if (params.type.length === 1) {
          query = query
            .filter(r.row('type').eq(params.type[0]));
        }
        if (params.type.length === 2) {
          query = query
            .filter(r.row('type').eq(params.type[0]).or(r.row('type').eq(params.type[1])));
        }
        if (params.type.length > 2) throw new errors.TrainTypeFilterParameterError();
      }
      return [query, departureTime, arrivalTime];
    })
    .spread(respond.bind(null, res))
    .catch(respond.bind(null, res));
};

module.exports = trainSearchController;
