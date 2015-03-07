/*global describe:true, it:true */
/*jshint node:true */
'use strict';
var should = require('should');
var request = require('supertest-as-promised');
var moment = require('moment');

var app = require('../index.js');
var agent = request.agent(app);

var get381Train = function (param, sendObject) {
  return agent.get('/v1/train/' + (param || 381)).send(sendObject);
};

var searchTrains = function (sendObject) {
  return agent.get('/v1/train/').send(sendObject || { from: '22nd-street' });
};

describe('Metadata', function () {

  describe('ETag', function () {
    it('should return an ETag', function (done) {
      get381Train()
        .expect(200)
        .then(function (res) {
          should.exist(res.headers.etag);
          done();
        });
    });

    it('should return the same ETag for the same request', function (done) {
      get381Train()
        .expect(200)
        .then(function (res) {
          var etag = res.headers.etag;
          return get381Train()
            .then(function (res) {
              etag.should.equal(res.headers.etag);
              done();
            });
        });
    });

    it('should return a different ETag for two different requests', function (done) {
      get381Train()
        .expect(200)
        .then(function (res) {
          var etag = res.headers.etag;
          return get381Train(385)
            .then(function (res) {
              etag.should.not.equal(res.headers.etag);
              done();
            });
        });
    });
  });

  describe('Last-Modified', function () {

    it('should return a valid `Last-Modified` header', function (done) {
      get381Train()
        .expect(200)
        .then(function (res) {
          should.exist(res.headers['last-modified']);
          var lastModified = moment(res.headers['last-modified']);
          lastModified._f.should.equal('YYYY-MM-DDTHH:mm:ss.SSSSZ'); // ISO 8601
          lastModified.isValid().should.equal(true);
          done();
        });
    });

  });

});