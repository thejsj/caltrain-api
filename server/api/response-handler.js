/*jshint node:true */
'use strict';
var q = require('q');
var _ = require('lodash');

var r = require('../db');
var splitAndTrim = require('../utils').splitAndTrim;
var getTimeFromMinutes = require('../utils').getTimeFromMinutes;

var fieldsHandler = function (res, query) {
  var params = res.locals.parameters;
  if (params.fields !== undefined) {
    return query.pluck.apply(query, splitAndTrim(params.fields));
  }
  return query;
};

var _parseTimeInEntry = function (entry) {
  // if (entry.stations) {
  //   for (let day in entry.stations) {
  //     for (let station in entry.stations[day]) {
  //       let time = getTimeFromMinutes(entry.stations[day][station]);
  //       entry.stations[day][station] = time;
  //     }
  //   }
  // }
  // // if (entry.times) {
  // //   for (let day in entry.times) {
  // //     for (let direction in entry.times[day]) {
  // //       for(var i = 0; i < entry.times[day][direction].length; i++) {
  // //         let _t = entry.times[day][direction][i];
  // //         entry.times[day][direction][i] = getTimeFromMinutes(_t);
  // //       }
  // //     }
  // //   }
  // // }
  // if (entry.times) {
  //   for (let day in entry.times) {
  //     for (let direction in entry.times[day]) {
  //       for(var i = 0; i < entry.times[day][direction].length; i++) {
  //         let _t = entry.times[day][direction][i];
  //         entry.times[day][direction][i] = getTimeFromMinutes(_t);
  //       }
  //     }
  //   }
  // }
  var _parseTime = function (object, key) {
    if (Array.isArray(object[key])) {
      for (let i = 0; i < object[key].length; i += 1) {
        object[key][i] = getTimeFromMinutes(object[key][i]);
      }
      return;
    }
    if (typeof _.values(object[key])[0] === 'number') {
      for (let i in object[key]) {
        object[key][i] = getTimeFromMinutes(object[key][i]);
      }
      return;
    }
    _.each(object[key], function (obj, newKey) {
      _parseTime(object[key], newKey);
    });
  };
  if (entry.stations) _parseTime(entry, 'stations');
  if (entry.trains) _parseTime(entry, 'trains');
  if (entry.times) _parseTime(entry, 'times');
};

var successHandler = function (res, jsonResponseObject) {
  if (Array.isArray(jsonResponseObject)) {
    // Array of Objects
    if(jsonResponseObject.length > 0 && _.keys(jsonResponseObject[0]).length === 0) {
      throw new Error('No fields returned for queried objects. Check your `fields` parameter in query');
    }
    jsonResponseObject.forEach(_parseTimeInEntry);
  } else {
    // Objects
    if (!Array.isArray(jsonResponseObject) && _.keys(jsonResponseObject).length === 0) {
      throw new Error('No fields returned for queried objects. Check your `fields` parameter in query');
    }
    _parseTimeInEntry(jsonResponseObject);
  }
  return q()
    .then(function () {
      return r.table('meta')('last_modified')
        .max().toISO8601()
        .run(r.conn);
    })
    .then(function (last_modified) {
      res.set('Last-Modified', last_modified);
      res.set('Parameters', JSON.stringify(res.locals.parameters));
      return res.json(jsonResponseObject);
    });
};

var errorHandler = function (res, err) {
  res.set('Parameters', JSON.stringify(res.locals.parameters));
  res.status(400);
  res.json({
    message: err.toString()
  });
};

var runHandler = function (query) {
  return query.run(r.conn);
};

var cursorHandler = function (cursorOrArray) {
  if (typeof cursorOrArray.each === 'function') {
    return cursorOrArray.toArray();
  }
  return cursorOrArray;
};

var responseHandler = function (res, query) {
  if (query instanceof Error) return errorHandler(res, query);
  return q()
    .then(fieldsHandler.bind(null, res, query))
    .then(runHandler)
    .then(cursorHandler)
    .then(successHandler.bind(null, res))
    .catch(errorHandler.bind(null, res));
};

exports.runHandler = runHandler;
exports.successHandler = successHandler;
exports.errorHandler = errorHandler;
exports.responseHandler = responseHandler;