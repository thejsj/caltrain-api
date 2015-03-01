/*global describe:true, it:true, xit:true */
/*jshint node:true */
'use strict';
require('should');
var request = require('supertest-as-promised');
var app = require('../index.js');
var agent = request.agent(app);

var get22ndStreetStation = function (sendObject) {
  return agent.get('/v1/station/').send(sendObject || { slug: '22nd-street' });
};

describe('/station', function () {

  describe('/', function () {
    it('should return a json object', function (done) {
        get22ndStreetStation()
          .expect(200)
          .then(function (res) {
            res.body.should.be.an.instanceOf(Object);
            done();
          });
     });

    it('should a return station when given its id', function (done) {
      get22ndStreetStation({
        // If we re-import the database, this will change... :(
        id: '71188cec-d3ec-4523-80db-535f9e0d51a7'
      })
      .expect(200)
      .then(function (res) {
        // console.log(res.body);
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

  describe('/search', function () {
    describe('Name Search', function () {
      xit('should a return an array or stations when given a name', function () { });
      xit('should only return stations that have the string as a sub string', function () { });
      xit('should return an array of length `0` when an irrelevant string is provided', function () { });
    });

    describe('Geolocation Search', function () {
      xit('should a return an array of stations when given a longitude and latitude', function () { });
      xit('should not return any results of all stations are farther away than 100 miles', function () { });
    });
  });

});