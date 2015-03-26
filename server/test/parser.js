/*global describe:true, it:true */

'use strict';
require('should');

var request = require('supertest-as-promised');
var app = require('../server.js');

var agent = request.agent(app);

var resHandler = (done, res) => {
  var parameters = JSON.parse(res.headers.parameters);
  parameters.should.be.an.instanceOf(Object);
  parameters.from.should.equal('22nd-street');
  done();
};

describe('Argument Parser', () => {
    it('should receive parameters through the data attribute', (done) => {
      agent
        .get('/v1/train/')
        .send({
          from: '22nd-street',
        })
        .expect(200)
        .then(resHandler.bind(null, done))
        .catch(done);
    });

    it('should receive GET query parameters', (done) => {
      agent
        .get('/v1/train/?from=22nd-street')
        .expect(200)
        .then(resHandler.bind(null, done))
        .catch(done);
    });

    it('should receive parameters through the data attribute', (done) => {
      agent
        .get('/v1/train/')
        .send('{"from": "22nd-street"}')
        .expect(200)
        .then(resHandler.bind(null, done))
        .catch(done);
    });

    it('should convert `_` separated arguments to camelCase', (done) => {
      agent
        .get('/v1/train/')
        .send({
          from: '22nd-street',
          time_format: 'minutes'
        })
        .expect(200)
        .then((res) => {
          var parameters = JSON.parse(res.headers.parameters);
          parameters.should.be.an.instanceOf(Object);
          parameters.from.should.equal('22nd-street');
          parameters.timeFormat.should.equal('minutes');
          done();
        })
        .catch(done);
    });
  });
