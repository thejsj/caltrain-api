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
  parameters.from.should.equal('22nd-street');
  done();
};

describe('Argument Parser', function () {
    it('should receive parameters through the data attribute', function (done) {
      agent
        .get('/v1/train/')
        .send({
          from: '22nd-street',
        })
        .expect(200)
        .then(resHandler.bind(null, done))
        .catch(done);
    });

    it('should receive GET query parameters', function (done) {
      agent
        .get('/v1/train/?from=22nd-street')
        .expect(200)
        .then(resHandler.bind(null, done))
        .catch(done);
    });

    it('should receive parameters through the data attribute', function (done) {
      agent
        .get('/v1/train/')
        .send('{"from": "22nd-street"}')
        .expect(200)
        .then(resHandler.bind(null, done))
        .catch(done);
    });
  });