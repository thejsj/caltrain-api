/*global describe:true, it:true, xit:true */
/*jshint node:true */
'use strict';
require('should');
var request = require('supertest-as-promised');
var app = require('../index.js');
var agent = request.agent(app);

var get22ndStreetStation = function (sendObject) {
  return agent.get('/v1/station/22nd-street').send(sendObject);
};

var searchStation = function (sendObject) {
  return agent.get('/v1/station/').send(sendObject || { name: 'san' });
};

describe('/station', function () {
  var stationUUID;

  describe('/:id_or_slug', function () {
    it('should return a json object', function (done) {
        get22ndStreetStation()
          .expect(200)
          .then(function (res) {
            res.body.should.be.an.instanceOf(Object);
            stationUUID = res.body.id;
            done();
          });
     });

    it('should a return station when given its id', function (done) {
      get22ndStreetStation({
        id: stationUUID
      })
      .expect(200)
      .then(function (res) {
        res.body.should.be.an.instanceOf(Object);
        res.body.slug.should.be.an.instanceOf(Object);
        res.body.slug.should.equal('22nd-street');
        done();
      });
     });

    it('should a return station when given its slug', function (done) {
      get22ndStreetStation()
        .expect(200)
        .then(function (res) {
          res.body.should.be.an.instanceOf(Object);
          res.body.slug.should.equal('22nd-street');
          done();
        });
     });
  });

  describe('/', function () {
    describe('Name Search', function () {
      it('should a return an array or stations when given a name', function (done) {
        searchStation({ 'name': 'mountain' })
          .expect(200)
          .then(function (res) {
            res.body.should.be.an.instanceOf(Array);
            res.body.length.should.equal(1);
            done();
          });
      });

      it('should only return stations that have the string as a sub string', function (done) {
        searchStation({ 'name': 'san' })
          .expect(200)
          .then(function (res) {
            res.body.should.be.an.instanceOf(Array);
            res.body.length.should.equal(9);
            res.body.forEach(function (row) {
              row.name.toLowerCase().match('san').length.should.not.equal(0);
            });
            done();
          });
      });
      it('should return an array of length `0` when an irrelevant string is provided', function (done) {
        searchStation({ 'name': 'asdfasfaeresrsdd' })
          .expect(200)
          .then(function (res) {
            res.body.should.be.an.instanceOf(Array);
            res.body.length.should.equal(0);
            done();
          });
      });
    });

    describe('Geolocation Search', function () {
      xit('should a return an array of stations when given a longitude and latitude', function () { });
      xit('should not return any results of all stations are farther away than 100 miles', function () { });
    });
  });

});