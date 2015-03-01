/*global describe:true, it:true */
/*jshint node:true */
'use strict';
require('should');
var request = require('supertest-as-promised');
var app = require('../index.js');
var agent = request.agent(app);
var _ = require('lodash');

var resHandler = function (done, res) {
  res.body.should.be.an.instanceOf(Object);
  res.body.parameters.from.should.be.an.instanceOf(String);
  res.body.parameters.from.should.equal('22nd-street');
  res.body.parameters.to.should.be.an.instanceOf(String);
  res.body.parameters.to.should.equal('mountain-view');
  done();
};

describe('Argument Parser', function () {
    it('should receive parameters through the data attribute', function (done) {
      agent
        .get('/v1/station/')
        .send({
          from: '22nd-street',
          to: 'mountain-view'
        })
        .expect(200)
        .then(resHandler.bind(null, done));
    });

    it('should receive GET query parameters', function (done) {
      agent
        .get('/v1/station/?from=22nd-street&to=mountain-view')
        .expect(200)
        .then(resHandler.bind(null, done));
    });

    it('should receive parameters through the data attribute', function (done) {
      agent
        .get('/v1/station/')
        .send('{"from": "22nd-street", "to": "mountain-view"}')
        .expect(200)
        .then(resHandler.bind(null, done));
    });
  });