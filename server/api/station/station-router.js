/*jshint node:true */
'use strict';

var express = require('express');
var stationController = require('./station-controller');
var stationSearchController = require('./station-search-controller');

var stationRouter = express.Router();

stationRouter.get('/search', stationSearchController);
stationRouter.post('/search', stationSearchController);
stationRouter.get('/', stationController);
stationRouter.post('/', stationController);

module.exports = stationRouter;