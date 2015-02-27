/*jshint node:true */
'use strict';

//dependencies
var bodyParser = require('body-parser'),
  express = require('express');

// Set routes
var apiRouter = require('./api');

// Init app
var app = express();

// Middlewares
app
  .use(bodyParser.urlencoded({
    extended: true
  }))
  .use(bodyParser.json());

// Set Routes
app
  .use('/api', apiRouter)
  .listen(8000, function () {
    console.log('Server listening on port:', 8000);
  });

module.exports = app;