/*global describe:true, it:true, xit:true */
/*jshint node:true */
'use strict';
require('should');
var request = require('supertest-as-promised');
var _ = require('lodash');
var app = require('../index.js');
var agent = request.agent(app);

var get381Train = function (sendObject) {
  return agent.get('/v1/train/').send(sendObject || { number: 381 });
};

var searchTrains = function (sendObject) {
  return agent.get('/v1/train/search').send(sendObject || { from: '22nd-street' });
};

describe('/train', function () {
  describe('/', function () {
    var trainId;
    it('should return a json object', function (done) {
      get381Train()
        .expect(200)
        .then(function (res) {
          res.body.should.be.an.instanceOf(Object);
          res.body.number.should.be.an.instanceOf(Number);
          trainId = res.body.id;
          done();
        });
    });
    it('should return the train specified by the ID', function (done) {
      get381Train({ id: trainId })
        .expect(200)
        .then(function (res) {
          res.body.should.be.an.instanceOf(Object);
          res.body.number.should.equal(381);
          done();
        });
    });
    it('should return the train specified by the number (Number)', function (done) {
      get381Train({ 'number': 381 })
        .expect(200)
        .then(function (res) {
          res.body.should.be.an.instanceOf(Object);
          res.body.number.should.equal(381);
          done();
        });
    });

   it('should return the train specified by the number (Number)', function (done) {
      get381Train({ 'number': '381' })
        .expect(200)
        .then(function (res) {
          res.body.should.be.an.instanceOf(Object);
          res.body.number.should.equal(381);
          done();
        });
    });
  });

  describe('/search', function () {

    it('should return an array', function (done) {
      searchTrains()
        .expect(200)
        .then(function (res) {
          res.body.should.be.an.instanceOf(Array);
          done();
        });
    });

    describe('From and To', function () {

      it('should only return trains that pass through the `from` station', function (done) {
        searchTrains({'from': '22nd-street', 'departure': 'Tue Mar 03 2015 08:17:43 GMT-0800 (PST)'})
          .then(function (res) {
            res.body.forEach(function (train) {
              _.some(_.keys(train.stations.weekday), function (stationName) {
                return stationName === '22nd-street';
              }).should.equal(true);
            });
            done();
          });
      });

      it('should only return trains that pass through the `from` station and `to` station', function (done) {
        searchTrains({
          'from': '22nd-street',
          'to': 'mountain-view',
          'departure': 'Tue Mar 03 2015 08:17:43 GMT-0800 (PST)'
        })
          .then(function (res) {
            res.body.forEach(function (train) {
              _.some(_.keys(train.stations.weekday), function (stationName) {
                return stationName === '22nd-street';
              }).should.equal(true);
              _.some(_.keys(train.stations.weekday), function (stationName) {
                return stationName === 'mountain-view';
              }).should.equal(true);
              train.direction.should.equal('south');
            });
            done();
          });
      });
    });

    describe('Departure', function () {

    });

    describe('Arrival', function () {

    });

    describe('Train Type Filter', function () {

    });
  });
});