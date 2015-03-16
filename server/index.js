/*jshint node:true */
'use strict';
var config = require('config');
console.log(config);
require('babel/register');
require('./server');