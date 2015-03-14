/*jshint node:true */
'use strict';
var q = require('q');
var _ = require('lodash');

var r = require('../db');
var splitAndTrim = require('../utils').splitAndTrim;
var parseTimeInEntry = require('../utils').parseTimeInEntry;

var fieldsHandler = (res, query) =>  {
  var params = res.locals.parameters;
  if (params.fields !== undefined) {
    return query.pluck.apply(query, splitAndTrim(params.fields));
  }
  return query;
};

var successHandler = (res, jsonResponseObject) =>  {
  var params = res.locals.parameters;
  if (Array.isArray(jsonResponseObject)) {
    // Array of Objects
    let keys = _.keys(jsonResponseObject[0]);
    if(jsonResponseObject.length > 0 && keys.length === 0) {
      throw new Error(
        'No fields returned for queried objects. '+
        'Check your `fields` parameter in query'
      );
    }
    jsonResponseObject.forEach(parseTimeInEntry.bind(
      null,
      params.queryDay,
      params.timeFormat
    ));
  } else {
    // Objects
    let keys = _.keys(jsonResponseObject);
    if (!Array.isArray(jsonResponseObject) && keys.length === 0) {
      throw new Error(
        'No fields returned for queried objects. ' +
        'Check your `fields` parameter in query'
      );
    }
    parseTimeInEntry(params.queryDay, params.timeFormat, jsonResponseObject);
  }
  return q()
    .then(() =>  {
      return r.table('meta')('last_modified')
        .max().toISO8601()
        .run(r.conn);
    })
    .then((last_modified) =>  {
      res.set('Last-Modified', last_modified);
      res.set('Parameters', JSON.stringify(res.locals.parameters));
      return res.json(jsonResponseObject);
    });
};

var errorHandler = (res, err) =>  {
  res.set('Parameters', JSON.stringify(res.locals.parameters));
  res.status(400);
  res.json({
    message: err.toString()
  });
};

var runHandler = (query) =>  {
  return query.run(r.conn);
};

var cursorHandler = (cursorOrArray) =>  {
  if (typeof cursorOrArray.each === 'function') {
    return cursorOrArray.toArray();
  }
  return cursorOrArray;
};

var responseHandler = (res, query) =>  {
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