/*jshint node:true */
'use strict';

var stationRouter = require('./train/train-router.js');
var trainRouter = require('./station/station-router.js');
var express = require('express');

var apiRouter = express.Router();

apiRouter.use('/station', stationRouter);
apiRouter.use('/train', trainRouter);

module.exports = apiRouter;