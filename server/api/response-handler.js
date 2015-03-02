/*jshint node:true */
'use strict';

var responseHandler = function (res, jsonResponseObject) {
  res.set('Parameters', JSON.stringify(res.locals.parameters));
  return res.json(jsonResponseObject);
};

var errorHandler = function (res, err) {
  res.set('Parameters', JSON.stringify(res.locals.parameters));
  res.status(400);
  res.json({
    code: 0,
    message: err
  });
};

var toArray = function (cursor) {
  return cursor.toArray();
};

exports.responseHandler = responseHandler;
exports.errorHandler = errorHandler;
exports.toArray = toArray;