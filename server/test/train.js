/*global describe:true, it:true */
/*jshint node:true */
'use strict';
require('should');
var request = require('supertest-as-promised');
var app = require('../index.js');
var agent = request.agent(app);

describe('/train', function () {
  it('should return a json object', function () { });
  it('should only return trains that pass through the `from` station', function () { });
  it('should only return trains that pass through the `from` station and `to` station', function () { });
  it('should only return trains that pass through the `from` station and `to` station', function () { });
  it('should only return trains that pass through the `from` station and `to` station', function () { });
});