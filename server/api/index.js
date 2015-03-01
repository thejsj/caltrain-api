/*jshint node:true */
'use strict';

var trainRouter = require('./train/train-router.js');
var stationRouter = require('./station/station-router.js');
var express = require('express');

var apiRouter = express.Router();

apiRouter.use('/station', stationRouter);
apiRouter.use('/train', trainRouter);

module.exports = apiRouter;