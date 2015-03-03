/*global describe:true, it:true */
/*jshint node:true */
'use strict';
require('should');
var request = require('supertest-as-promised');
var app = require('../index.js');
var agent = request.agent(app);

var resHandler = function (done, res) {
  var parameters = JSON.parse(res.headers.parameters);
  parameters.should.be.an.instanceOf(Object);
  parameters.number.should.equal('381');
  done();
};

describe('Argument Parser', function () {
    it('should receive parameters through the data attribute', function (done) {
      agent
        .get('/v1/train/')
        .send({
          number: '381',
        })
        .expect(200)
        .then(resHandler.bind(null, done));
    });

    it('should receive GET query parameters', function (done) {
      agent
        .get('/v1/train/?number=381')
        .expect(200)
        .then(resHandler.bind(null, done));
    });

    it('should receive parameters through the data attribute', function (done) {
      agent
        .get('/v1/train/')
        .send('{"number": "381"}')
        .expect(200)
        .then(resHandler.bind(null, done));
    });
  });