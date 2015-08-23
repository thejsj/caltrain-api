/*global describe:true, it:true */
'use strict';
var should = require('should');
var request = require('supertest-as-promised');
var moment = require('moment');
var _ = require('lodash');

var app = require('../server.js');
var agent = request.agent(app);

var get381Train = (param, sendObject) => {
  return agent.get('/v1/train/' + (param || 381)).send(sendObject);
};

var searchTrains = (sendObject) => {
  return agent.get('/v1/train/').send(sendObject || { from: '22nd-street' });
};
var weekdayMorningTimeString = 'Tue Mar 03 2015 08:17:43 GMT-0700 (PST)';

describe('Metadata', () => {

  describe('ETag', () => {
    it('should return an ETag', (done) => {
      get381Train()
        .expect(200)
        .then((res) => {
          should.exist(res.headers.etag);
          done();
        })
        .catch(done);
    });

    it('should return the same ETag for the same request', (done) => {
      get381Train()
        .expect(200)
        .then((res) => {
          var etag = res.headers.etag;
          return get381Train()
            .then((res) => {
              etag.should.equal(res.headers.etag);
              done();
            });
        })
        .catch(done);
    });

    it('should return a different ETag for two different requests', (done) => {
      get381Train()
        .expect(200)
        .then((res) => {
          var etag = res.headers.etag;
          return get381Train(385)
            .then((res) => {
              etag.should.not.equal(res.headers.etag);
              done();
            });
        })
        .catch(done);
    });
  });

  describe('Last-Modified', () => {

    it('should return a valid `Last-Modified` header', (done) => {
      get381Train()
        .expect(200)
        .then((res) => {
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
      get381Train(false, {'timeFormat': 'YYYY', 'departure': weekdayMorningTimeString })
        .expect(200)
        .then((res) => {
          res.body.should.have.property('times');
          res.body.times.should.be.an.Array;
          res.body.times.length.should.be.above(0);
          res.body.times.forEach((time) => {
            time.should.equal(year);
          });
          _.each(res.body.stations, (time) => {
            time.should.equal(year);
          });
          done();
        })
        .catch(done);
    });

    it('should accept arbitrary time formats (`YYYY MM`)', (done) => {
      var year_month = moment().format('YYYY MM');
      searchTrains({ timeFormat: 'YYYY MM' })
        .expect(200)
        .then((res) => {
          res.body.forEach((train) => {
            if (Array.isArray(train.times)) {
              train.times.forEach((time) => {
                time.should.equal(year_month);
              });
              _.each(train.stations, (time) => {
                time.should.equal(year_month);
              });
            }
          });
          done();
        })
        .catch(done);
    });

  });

  describe('Query Day', () => {

    it('should accept a query day and return all times in that query day', (done) => {
      var format = 'YYYY MM DD';
      var time = moment().add(100, 'days');
      var time_string = time.format(format);
      get381Train(false, {'timeFormat': format, queryDay: time.toString() })
        .expect(200)
        .then((res) => {
          res.body.times.forEach((time) => {
            time.should.equal(time_string);
          });
          _.each(res.body.stations, (time) => {
            time.should.equal(time_string);
          });
          done();
        });
    });

    it('should throw an error when the query day is different from `departure`', (done) => {
      var queryDay = moment();
      var departure = queryDay.clone().add(100, 'days');
      searchTrains({ from: '22nd-street', departure: departure, queryDay: queryDay })
        .expect(400)
        .then((res) => {
          res.body.message.should.match(/Departure/);
          res.body.message.should.match(/query/);
          done();
        });
    });

    it('should throw an error when the query day is different from `arrival`', (done) => {
      var queryDay = moment();
      var arrival = queryDay.clone().add(100, 'days');
      searchTrains({ to: '22nd-street', arrival: arrival, queryDay: queryDay })
        .expect(400)
        .then((res) => {
          res.body.message.should.match(/Arrival/);
          res.body.message.should.match(/query/);
          done();
        });
    });

  });
});
