/*jshint node:true */
'use strict';
var _ = require('lodash');

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
    res.locals.response = {};
    res.locals.response.parameters = _.extend(
      {},
      req.query,
      bodyParamaterParser(req.body),
      req.params
    );
    next();
  };
};


module.exports = argumentParser;