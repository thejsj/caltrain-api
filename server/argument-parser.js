'use strict';
var _ = require('lodash');
var moment = require('moment');

var responseHandler = require('./api/response-handler').responseHandler;
var splitAndTrim = require('./utils').splitAndTrim;

var camelCase = (input) => {
    return input.toLowerCase().replace(/_(.)/g, (match, group1)  => {
        return group1.toUpperCase();
    });
};

var bodyParamaterParser = (bodyObject) => {
  if (_.size(bodyObject) === 1 && _.values(bodyObject)[0] === '') {
    try {
      return JSON.parse(_.keys(bodyObject)[0]);
    } catch(err) {
      return bodyObject;
    }
  }
  return bodyObject;
};

var argumentParser = () => {
  /**
   * Possible Parameters
   *
   *    fields <Array>
   *
   * /station
   *    name <String>
   *    latitude <Number>
   *    longitude <Number>
   *
   * /train
   *    from <String>
   *    to <String>
   *    departure <String>/<Number>
   *    arrival <String>/<Number>
   *    type <Array>
   */
  return (req, res, next) => {
    var params = _.extend(
      {},
      req.query,
      bodyParamaterParser(req.body),
      req.params
    );
    // Parse Array Types
    if (params.type !== undefined) {
      params.type = splitAndTrim(params.type);
    }
    // Convert _ to CamelCase
    for (var key in params) {
      if (key.indexOf('_') !== -1) {
        let val = params[key];
        delete params[key];
        if (camelCase(key)) params[camelCase(key)] = val;
      }
    }
    var getDate = function (time, name, res) {
      var date = new Date((function () {
        if (
          typeof time === 'number' ||
          typeof time === 'string' && time.match(/^[0-9]*$/) !== null
        ) {
          return +(time);
        }
        return time;
      }()));
      if (date.toString() === 'Invalid Date') {
         return responseHandler(
           res,
           new Error('Timestamp/Data provided for `' + name + '` is invalid')
         );
      }
      return date;
    };
    params.queryDay = moment(() => {
      if (params.queryDay !== undefined) {
        var queryDay = getDate(params.queryDay);
        return moment(queryDay);
      }
      if (params.departure !== undefined) {
        var departure = getDate(params.departure);
        return moment(departure).set({
          hour: 1, minute: 0, seconds: 0, milliseconds: 0
        });
      }
      if (params.arrival !== undefined) {
        var arrival = getDate(params.arrival);
        return moment(arrival).set({
          hour: 1, minute: 0, seconds: 0, milliseconds: 0
        });
      }
      return new Date(); // Default to today
    }());
    params = _.defaults(params, {
      timeFormat: moment.defaultFormat
    });
    params.queryDay = params.queryDay.set({ hour: 1, minute: 0, second: 0 });
    res.locals.parameters = params;
    next();
  };
};


module.exports = argumentParser;
