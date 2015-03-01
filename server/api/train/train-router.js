/*jshint node:true */
'use strict';

var express = require('express');
var trainRouteController = require('./train-controller');

var trainRouter = express.Router();

trainRouter.get('/', trainRouteController);
trainRouter.post('/', trainRouteController);

module.exports = trainRouter;