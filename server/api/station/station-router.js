/*jshint node:true */
'use strict';

var express = require('express');
var stationRouteController = require('./station-controller');

var stationRouter = express.Router();

stationRouter.get('/', stationRouteController);
stationRouter.post('/', stationRouteController);

module.exports = stationRouter;