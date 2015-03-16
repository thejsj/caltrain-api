/*jshint node:true */
'use strict';
var config = require('config');
var bodyParser = require('body-parser');
var express = require('express');
var compression = require('compression');

var argumentParser = require('./argument-parser');
var etagGenerator = require('./etag-generator');
var send404 = require('./send-404');
var apiRouter = require('./api');

var app = express();

// Middlewares
app
  .set('json spaces', 4)
  .use(compression())
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
  .use(express.static(__dirname + '/site'))
  .use('*', send404)
  .listen(config.get('ports').http, () =>  {
    console.log('Server listening on port:', config.get('ports').http);
  });

module.exports = app;