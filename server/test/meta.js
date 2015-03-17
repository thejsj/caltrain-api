/*global describe:true, it:true */
/*jshint node:true */
'use strict';
var should = require('should');
var request = require('supertest-as-promised');
var moment = require('moment');

var app = require('../server.js');
var agent = request.agent(app);

var get381Train = (param, sendObject) =>  {
  return agent.get('/v1/train/' + (param || 381)).send(sendObject);
};

var searchTrains = (sendObject) =>  {
  return agent.get('/v1/train/').send(sendObject || { from: '22nd-street' });
};

describe('Metadata', () =>  {

  describe('ETag', () =>  {
    it('should return an ETag', (done) =>  {
      get381Train()
        .expect(200)
        .then((res) =>  {
          should.exist(res.headers.etag);
          done();
        })
        .catch(done);
    });

    it('should return the same ETag for the same request', (done) =>  {
      get381Train()
        .expect(200)
        .then((res) =>  {
          var etag = res.headers.etag;
          return get381Train()
            .then((res) =>  {
              etag.should.equal(res.headers.etag);
              done();
            });
        })
        .catch(done);
    });

    it('should return a different ETag for two different requests', (done) =>  {
      get381Train()
        .expect(200)
        .then((res) =>  {
          var etag = res.headers.etag;
          return get381Train(385)
            .then((res) =>  {
              etag.should.not.equal(res.headers.etag);
              done();
            });
        })
        .catch(done);
    });
  });

  describe('Last-Modified', () =>  {

    it('should return a valid `Last-Modified` header', (done) =>  {
      get381Train()
        .expect(200)
        .then((res) =>  {
          should.exist(res.headers['last-modified']);
          var lastModified = moment(res.headers['last-modified']);
          lastModified._f.should.equal('YYYY-MM-DDTHH:mm:ss.SSSSZ'); // ISO 8601
          lastModified.isValid().should.equal(true);
          done();
        })
        .catch(done);
    });

  });

});