/*jshint node:true */
'use strict';
var _ = require('lodash');
var splitAndTrim = require('./utils').splitAndTrim;

var camelCase = function(input) {
    return input.toLowerCase().replace(/_(.)/g, function(match, group1) {
        return group1.toUpperCase();
    });
};

var checkArguments = function (params, opts) {
  if (typeof opts.property !== 'string') throw new Error('checkArguments requires `property` String');
  if (!Array.isArray(opts.args)) throw new Error('checkArguments requires array `args`');
  if (params[opts.property] !== undefined && !_.contains(opts.args, params[opts.property])) {
    throw new Error('Invalid argument supplied for ' + opts.property);
  }
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
    params = _.defaults(params, {
      'timeFormat': 'H:mm'
    });
    checkArguments(params, {
      'property': 'timeFormat',
      'args': ['H:mm',  'minutes']
    });
    res.locals.parameters = params;
    next();
  };
};


module.exports = argumentParser;