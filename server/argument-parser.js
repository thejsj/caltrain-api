/*jshint node:true */
'use strict';
var _ = require('lodash');
var splitAndTrim = require('./utils').splitAndTrim;

var camelCase = function(input) {
    return input.toLowerCase().replace(/_(.)/g, function(match, group1) {
        return group1.toUpperCase();
    });
};

var bodyParamaterParser = function (bodyObject) {
  if (_.size(bodyObject) === 1 && _.values(bodyObject)[0] === '') {
    try {
      return JSON.parse(_.keys(bodyObject)[0]);
    } catch(err) {
      return bodyObject;
    }
  }
  return bodyObject;
};

var argumentParser = function () {
  return function (req, res, next) {
    var params = _.extend(
      {},
      req.query,
      bodyParamaterParser(req.body),
      req.params
    );
    if (params.type !== undefined) {
      params.type = splitAndTrim(params.type);
    }
    for (var key in params) {
      if (key.indexOf('_') !== -1) {
        let val = params[key];
        delete params[key];
        params[camelCase(key)] = val;
      }
    }
    res.locals.parameters = _.defaults(params, {
      'timeFormat': 'H:mm'
    });
    next();
  };
};


module.exports = argumentParser;