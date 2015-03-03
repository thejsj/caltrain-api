/*jshint node:true */
'use strict';

var express = require('express');
var trainController = require('./train-controller');
var trainSearchController = require('./train-search-controller');

var trainRouter = express.Router();

trainRouter.get('/search', trainSearchController);
trainRouter.post('/search', trainSearchController);

trainRouter.get('/', trainController);
trainRouter.post('/', trainController);

module.exports = trainRouter;