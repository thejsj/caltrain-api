/*jshint node:true */
'use strict';
var moment = require('moment');
var _ = require('lodash');

var r = require('./db');

/**
 * Take the arguments in the function and make a recursive object out of them
 * Ex: 1, 2, 3 -> {1: {2: 3}}
 */
var arrayToObject = function () {
  var args = _.toArray(arguments);
  if (args.length < 2) throw new Error('At least two arguments needed');
  var obj = { };
  obj[args[args.length - 2]] = args[args.length - 1];
  if (args.length === 2) return obj;
  for (var i = args.length - 3; i >= 0; i -= 1) {
    var copy = {};
    copy[args[i]] = _.clone(obj);
    obj = copy;
  }
  return obj;
};

/**
 * Get whether the moment instance if 'weekday', 'saturday', or 'sunday'
 *
 * @param time (moment instance) (default: moment now)
 */
var getWeekday = function (time) {
  if (typeof time === 'boolean') time = moment();
  var day = time.format('dddd');
  if (day === 'sunday' || day === 'saturday') return day;
  return 'weekday';
};

var getSingleStationLocationIndexQuery = function (stationSlug) {
  return r.db('caltrain_test').table('stations')
    .getAll(stationSlug, {'index': 'slug'}).limit(1)(0)('location_index');
};

var getTimeFromMinutes = function (minutesString) {
  var minutes = '' + minutesString % 60;
  if (minutes.length === 1) minutes = '0' + minutes;
  return '' + Math.floor(minutesString / 60) + ':' + minutes;
};

var getMinutesFromTime = function (hours, minutes) {
  return ((+hours) * 60 + (+minutes)) % 1440;
};

var isLatitude = function (str) {
  var _isLatitude = new RegExp(/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/);
  return _isLatitude.test(str);
};

var isLongitude = function (str) {
  var _isLongitude = new RegExp(/^[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/);
  return _isLongitude.test(str);
};

var splitAndTrim = function (str) {
  var array;
  if (typeof str === 'string') array = str.split(',');
  else if (Array.isArray(str)) array = str;
  else throw new Error('Parameter only takes comma-separated string or array as input');
  return array.map(function (type) {
      return type.trim();
    });
};

exports.arrayToObject = arrayToObject;
exports.getWeekday = getWeekday;
exports.getSingleStationLocationIndexQuery = getSingleStationLocationIndexQuery;
exports.getTimeFromMinutes = getTimeFromMinutes;
exports.getMinutesFromTime = getMinutesFromTime;
exports.isLongitude = isLongitude;
exports.isLatitude = isLatitude;
exports.splitAndTrim = splitAndTrim;