/*global describe:true, it:true */
/*jshint node:true */
'use strict';
require('should');
var request = require('supertest-as-promised');
var _ = require('lodash');

var app = require('../index.js');
var agent = request.agent(app);

var get381Train = function (param, sendObject) {
  return agent.get('/v1/train/' + (param || 381)).send(sendObject);
};

// var searchTrains = function (sendObject) {
//   return agent.get('/v1/train/').send(sendObject || { from: '22nd-street' });
// };

describe('Global', function () {

  describe('Fields', function () {
    it('should filter out fields if passed a `fields` parameter as a comma-separated string', function (done) {
      get381Train('381', {'fields': 'number,direction'})
        .expect(200)
        .then(function (res) {
          _.keys(res.body).should.eql(['direction', 'number']);
          done();
        });
    });

    it('should filter out fields if passed a `fields` parameter as an array', function (done) {
      get381Train('381', {'fields': ['number', 'direction']})
        .expect(200)
        .then(function (res) {
          _.keys(res.body).should.eql(['direction', 'number']);
          done();
        });
    });

    it('should throw an error if none of the fields exist', function (done) {
      get381Train('381', {'fields': 'numasdfadber,directiasdfasdon'})
        .expect(400)
        .then(function (res) {
          res.body.message.match(/fields/);
          done();
        });
    });
  });

});