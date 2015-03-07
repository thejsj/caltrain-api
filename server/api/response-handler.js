/*jshint node:true */
'use strict';
var q = require('q');
var r = require('../db');

var successHandler = function (res, jsonResponseObject) {
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
    code: 0,
    message: err
  });
};

var runHandler = function (query) {
  return query.run(r.conn);
};

var toArray = function (cursor) {
  return cursor.toArray();
};

var responseHandler = function (res, query) {
  return q()
    .then(runHandler.bind(null, query))
    .then(function (cursorOrArray) {
      if (typeof cursorOrArray.each === 'function') {
        return cursorOrArray.toArray();
      }
      return cursorOrArray;
    })
    .then(successHandler.bind(null, res))
    .catch(errorHandler.bind(null, res));
};

exports.runHandler = runHandler;
exports.successHandler = successHandler;
exports.errorHandler = errorHandler;
exports.toArray = toArray;
exports.responseHandler = responseHandler;