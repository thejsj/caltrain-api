/*jshint node:true */
'use strict';

var express = require('express');
var stationController = require('./station-controller');
var stationSearchController = require('./station-search-controller');

var stationRouter = express.Router();

stationRouter.get('/:id([A-z0-9]{8}-[A-z0-9]{4}-[A-z0-9]{4}-[A-z0-9]{4}-[A-z0-9]{12})', stationController);
stationRouter.post('/:id([A-z0-9]{8}-[A-z0-9]{4}-[A-z0-9]{4}-[A-z0-9]{4}-[A-z0-9]{12})', stationController);

stationRouter.get('/:slug([A-z0-9-]+)', stationController);
stationRouter.post('/:slug([A-z0-9-]+)', stationController);

stationRouter.get('/', stationSearchController);
stationRouter.post('/', stationSearchController);

module.exports = stationRouter;