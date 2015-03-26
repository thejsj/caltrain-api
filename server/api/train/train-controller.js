'use strict';
var q = require('q');
var _ = require('lodash');

var r = require('../../db');
var respond = require('../response-handler').responseHandler;
var errors = require('../errors');

var trainController = (req, res) => {
  _.extend(res.locals.parameters, req.params);
  var params = res.locals.parameters;
  return q()
    .then(() => {
      if (params.number === undefined && params.id === undefined) {
        throw new errors.NotEnoughParametersError();
      }
      return r.table('trains');
    })
    .then((query) => {
      if (params.number !== undefined) return query.getAll(+params.number, {'index': 'number'})(0);
      if (params.id !== undefined) return query.get(params.id);
    })
    .then(respond.bind(null, res))
    .catch(respond.bind(null, res));
};

module.exports = trainController;
