/*jshint node:true */
'use strict';

var express = require('express');
var trainController = require('./train-controller');
var trainSearchController = require('./train-search-controller');

var trainRouter = express.Router();
// 2b35a1f9-51d8-4b9a-80aa-c77b0d0e28b5
trainRouter.route('/:id([A-z0-9]{8}-[A-z0-9]{4}-[A-z0-9]{4}-[A-z0-9]{4}-[A-z0-9]{12})')
  .get(trainController)
  .post(trainController);

trainRouter.route('/:number([0-9]+)')
  .get(trainController)
  .post(trainController);

trainRouter.get('/', trainSearchController);
trainRouter.post('/', trainSearchController);

module.exports = trainRouter;