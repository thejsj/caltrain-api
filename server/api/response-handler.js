'use strict';
var config = require('config');
var q = require('q');
var _ = require('lodash');
var ua = require('universal-analytics');

var r = require('../db');
var splitAndTrim = require('../utils').splitAndTrim;
var parseTimeInEntry = require('../utils').parseTimeInEntry;
var errors = require('./errors');

var fieldsHandler = (res, query) => {
  var params = res.locals.parameters;
  if (params.fields !== undefined) {
    return query.pluck.apply(query, splitAndTrim(params.fields));
  }
  return query;
};

var successHandler = (res, jsonResponseObject) => {
  var params = res.locals.parameters;
  if (Array.isArray(jsonResponseObject)) {
    // Array of Objects
    let keys = _.keys(jsonResponseObject[0]);
    if(jsonResponseObject.length > 0 && keys.length === 0) {
      throw new errors.FieldsParameterValueError();
    }
    jsonResponseObject = jsonResponseObject.map(parseTimeInEntry.bind(
      null,
      params.queryDay,
      params.timeFormat
    ));
  } else {
    // Objects
    let keys = _.keys(jsonResponseObject);
    if (!Array.isArray(jsonResponseObject) && keys.length === 0) {
      throw new errors.FieldsParameterValueError();
    }
    jsonResponseObject = parseTimeInEntry(params.queryDay, params.timeFormat, jsonResponseObject);
  }
  return q()
    .then(() => {
      return r.connect(config.get('rethinkdb'))
        .then((conn) => {
          return r.table('meta')('last_modified')
            .max().toISO8601()
            .run(conn)
            .finally(() => conn.close());
        });
    })
    .then((last_modified) => {
      res.set('Last-Modified', last_modified);
      res.set('Parameters', JSON.stringify(res.locals.parameters));
      return res.json(jsonResponseObject);
    });
};

var errorHandler = (res, err) => {
  res.set('Parameters', JSON.stringify(res.locals.parameters));
  res.status(400);
  res.json({
    error: err.name,
    message: err.message
  });
};

var runHandler = (query) => {
  return r.connect(config.get('rethinkdb'))
    .then((conn) => {
      return query.run(conn).finally(() => conn.close());
    });
};

var queryErrorHandler = (err) => {
  throw new errors.QueryError();
};

var cursorHandler = (cursorOrArray) => {
  if (typeof cursorOrArray.each === 'function') {
    return cursorOrArray.toArray();
  }
  return cursorOrArray;
};

var analytisHandler = (res) => {
  if (config.get('googleAnalyticsUACode')) {
    var visitor = ua(config.get('googleAnalyticsUACode'));
    visitor.pageview(res.req.originalUrl).send();
  }
};

var responseHandler = (res, query) => {
  if (query instanceof Error) return errorHandler(res, query);
  return q()
    .then(fieldsHandler.bind(null, res, query))
    .then(runHandler)
    .catch(queryErrorHandler)
    .then(cursorHandler)
    .then(successHandler.bind(null, res))
    .catch(errorHandler.bind(null, res))
    .then(analytisHandler.bind(null, res));
};

exports.runHandler = runHandler;
exports.successHandler = successHandler;
exports.errorHandler = errorHandler;
exports.responseHandler = responseHandler;
