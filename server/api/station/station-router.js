/*jshint node:true */
'use strict';

var express = require('express');
var stationController = require('./station-controller');
var stationSearchController = require('./station-search-controller');

var stationRouter = express.Router();

stationRouter.route('/:id([A-z0-9]{8}-[A-z0-9]{4}-[A-z0-9]{4}-[A-z0-9]{4}-[A-z0-9]{12})')
  .get(stationController)
  .post(stationController);

stationRouter.route('/:slug([A-z0-9-]+)')
  .get(stationController)
  .post(stationController);

stationRouter.route('/')
  .get(stationSearchController)
  .post(stationSearchController);

module.exports = stationRouter;