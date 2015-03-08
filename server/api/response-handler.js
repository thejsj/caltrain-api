/*jshint node:true */
'use strict';
var q = require('q');
var _ = require('lodash');

var r = require('../db');
var splitAndTrim = require('../utils').splitAndTrim;

var fieldsHandler = function (res, query) {
  var params = res.locals.parameters;
  if (params.fields !== undefined) {
    return query.pluck.apply(query, splitAndTrim(params.fields));
  }
  return query;
};

var successHandler = function (res, jsonResponseObject) {
  if (Array.isArray(jsonResponseObject) &&
    jsonResponseObject.length > 0 &&
    _.keys(jsonResponseObject[0]).length === 0
  ) {
    throw new Error('No fields returned for queried objects. Check your `fields` parameter in query');
  }
  if (typeof jsonResponseObject === 'object' &&
      !Array.isArray(jsonResponseObject) &&
      _.keys(jsonResponseObject).length === 0
  ) {
    throw new Error('No fields returned for queried objects. Check your `fields` parameter in query');
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