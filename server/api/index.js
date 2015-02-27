/*jshint node:true */
'use strict';

var stationRouter = require('./train/trainRouter.js');
var trainRouter = require('./station/stationRouter.js');
var express = require('express');

var apiRouter = express.Router();

apiRouter.use('/station', stationRouter);
apiRouter.use('/train', trainRouter);

module.exports = apiRouter;