/*jshint node:true */
'use strict';

var express = require('express');
var trainController = require('./train-controller');

var trainRouter = express.Router();

trainRouter.get('/', trainController);
trainRouter.post('/', trainController);

module.exports = trainRouter;