/*jshint node:true */
'use strict';

var sendReponse = function (res, jsonResponseObject) {
  res.set('Parameters', JSON.stringify(res.locals.parameters));
  return res.json(jsonResponseObject);
};

module.exports = sendReponse;