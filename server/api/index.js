/*jshint node:true */
'use strict';
var express = require('express');

var trainRouter = require('./train/train-router.js');
var stationRouter = require('./station/station-router.js');

var apiRouter = express.Router();

apiRouter.use('/station', stationRouter);
apiRouter.use('/train', trainRouter);

module.exports = apiRouter;