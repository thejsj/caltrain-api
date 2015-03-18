/*jshint node:true */
'use strict';
var moment = require('moment');
var _ = require('lodash');

var r = require('./db');

/**
 * Take the arguments in the function and make a recursive object out of them
 * Ex: 1, 2, 3 -> {1: {2: 3}}
 * This should be a normal function and not an arrow function
 * https://github.com/babel/babel/issues/880
 */
var arrayToObject = function ()  {
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
var getWeekday = (time) => {
  if (typeof time === 'boolean') time = moment();
  var day = time.format('dddd');
  if (day === 'sunday' || day === 'saturday') return day;
  return 'weekday';
};

var getSingleStationLocationIndexQuery = (stationSlug) => {
  return r.table('stations')
    .getAll(stationSlug, {'index': 'slug'}).limit(1)(0)('location_index');
};

var getTimeFromMinutes = (minutesString) => {
  var minutes = '' + minutesString % 60;
  if (minutes.length === 1) minutes = '0' + minutes;
  return '' + Math.floor(minutesString / 60) + ':' + minutes;
};

var getMinutesFromTime = (hours, minutes) => {
  return ((+hours) * 60 + (+minutes)) % 1440;
};

var isLatitude = (str) => {
  var _isLatitude = new RegExp(/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/);
  return _isLatitude.test(str);
};

var isLongitude = (str) => {
  var _isLongitude = new RegExp(
    /^[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/
  );
  return _isLongitude.test(str);
};

var splitAndTrim = (str) => {
  var array;
  if (typeof str === 'string') array = str.split(',');
  else if (Array.isArray(str)) array = str;
  else throw new Error(
    'Parameter only takes comma-separated string or array as input'
  );
  return array.map((type) => {
      return type.trim();
    });
};

var parseTimeInEntry = (queryDay, timeFormat, entry) => {
  var _parseTime = (object, key) => {
    if (Array.isArray(object[key])) {
      for (let i = 0; i < object[key].length; i += 1) {
        object[key][i] = queryDay.clone().minutes(object[key][i]);
        if (timeFormat) object[key][i] = object[key][i].format(timeFormat);
      }
      return;
    }
    if (typeof _.values(object[key])[0] === 'number') {
      for (let i in object[key]) {
        object[key][i] = queryDay.clone().minutes(object[key][i]);
        if (timeFormat) object[key][i] = object[key][i].format(timeFormat);
      }
      return;
    }
    _.each(object[key], (obj, newKey) => {
      _parseTime(object[key], newKey);
    });
  };
  var dayType = getWeekday(queryDay);
  if (entry.stations) {
    _parseTime(entry.stations, dayType);
    entry.stations = entry.stations[dayType];
  }
  if (entry.trains) {
    _parseTime(entry.trains, dayType);
    entry.trains = entry.trains[dayType];
  }
  if (entry.times) {
    _parseTime(entry.times, dayType);
    entry.times = entry.times[dayType];
  }
};

exports.arrayToObject = arrayToObject;
exports.getWeekday = getWeekday;
exports.getSingleStationLocationIndexQuery = getSingleStationLocationIndexQuery;
exports.getTimeFromMinutes = getTimeFromMinutes;
exports.getMinutesFromTime = getMinutesFromTime;
exports.isLongitude = isLongitude;
exports.isLatitude = isLatitude;
exports.splitAndTrim = splitAndTrim;
exports.parseTimeInEntry = parseTimeInEntry;
