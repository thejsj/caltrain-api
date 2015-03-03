/*global describe:true, it:true, xit:true */
/*jshint node:true */
'use strict';
require('should');
var request = require('supertest-as-promised');
var app = require('../index.js');
var agent = request.agent(app);

var get381Train = function (sendObject) {
  return agent.get('/v1/train/').send(sendObject || { number: 381 });
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

    describe('From and To', function () {
      xit('should only return trains that pass through the `from` station', function () { });
      xit('should only return trains that pass through the `from` station and `to` station', function () { });
      xit('should only return trains that pass through the `from` station and `to` station', function () { });
      xit('should only return trains that pass through the `from` station and `to` station', function () { });
    });

    describe('Departure', function () {

    });

    describe('Arrival', function () {

    });


    describe('Train Type Filter', function () {

    });
  });
});