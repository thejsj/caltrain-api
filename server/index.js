/*jshint node:true */
'use strict';
var bodyParser = require('body-parser');
var express = require('express');

var argumentParser = require('./argument-parser');
var etagGenerator = require('./etag-generator');
var send404 = require('./send-404');
var apiRouter = require('./api');

var app = express();

// Middlewares
app
  .set('json spaces', 4)
  .use(bodyParser.raw())
  .use(bodyParser.text())
  .use(bodyParser.urlencoded({
    extended: true
  }))
  .use(bodyParser.json())
  .use(argumentParser())
  .set('etag', etagGenerator());

// Set Routes
app
  .use('/v1', apiRouter)
  .use('*', send404)
  .listen(8000, function () {
    console.log('Server listening on port:', 8000);
  });

module.exports = app;