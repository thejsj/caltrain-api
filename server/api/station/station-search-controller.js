'use strict';
var q = require('q');

var isLongitude = require('../../utils').isLongitude;
var isLatitude = require('../../utils').isLatitude;

var r = require('../../db');
var respond = require('../response-handler').responseHandler;
var errors = require('../errors');

var stationSearchController = (req, res) => {
  var params = res.locals.parameters;
  return q()
    .then(() => {
      return r.table('stations');
    })
    .then((query) => {
      if (params.name !== undefined) {
        return query
          .filter((row) => {
            return r.expr(row('slug').match(params.name.toLowerCase()))
              .or(row('name').downcase().match(params.name.toLowerCase()));
          });
      }
      return query;
    })
    .then((query) => {
      if (params.latitude !== undefined && params.longitude !== undefined) {
        if (!isLatitude(params.latitude)) {
          throw new errors.LatitudeParameterValueError();
        }
        if (!isLongitude(params.longitude)) {
          throw new errors.LongitudeParameterValueError();
        }
        return query
          .merge((row) => {
            return { 'distance':
              r.distance(
                row('location'), r.point(+params.longitude, +params.latitude)
              )
            };
          })
          .orderBy((row) => {
            return row('distance');
          });
      }
      return query;
    })
    .then(respond.bind(null, res))
    .catch(respond.bind(null, res));
};

module.exports = stationSearchController;
