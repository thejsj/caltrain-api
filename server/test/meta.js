/*global describe:true, it:true */
/*jshint node:true */
'use strict';
var should = require('should');
var request = require('supertest-as-promised');
var moment = require('moment');
var _ = require('lodash');

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

  describe('Time Formatas', () => {

    it('should accept arbitrary time formats (`YYYY`)', (done) => {
      var year = moment().format('YYYY');
      get381Train(false, {'timeFormat': 'YYYY'})
        .expect(200)
        .then((res) => {
          res.body.times.forEach((time) => {
            time.should.equal(year);
          });
          _.each(res.body.stations, (time) => {
            time.should.equal(year);
          });
          done();
        });
    });

    it('should accept arbitrary time formats (`YYYY MM`)', () => {
      var year_month = moment().format('YYYY MM');
      searchTrains({ timeFormat: 'YYYY MM' })
        .expect(200)
        .then((res) => {
          res.body.forEach((train) => {
            train.times.forEach((time) => {
              time.should.equal(year_month);
            });
            _.each(train.stations, (time) => {
              time.should.equal(year_month);
            });
          });
          done();
        });
    });

  });


  describe('Query Day', () => {

    xit('should accept a query day and return all times in that query day', () => {

    });

    xit('should throw an error when the query day is different from `departure`', () => {

    });

    xit('should throw an error when the query day is different from `arrival`', () => {

    });

  });
});
