/*global describe:true, it:true */
/*jshint node:true */
'use strict';
require('should');
var request = require('supertest-as-promised');
var _ = require('lodash');

var app = require('../server.js');
var agent = request.agent(app);
var getTimeFromMinutes = require('../utils').getTimeFromMinutes;

var get381Train = (param, sendObject) =>  {
  return agent.get('/v1/train/' + (param || 381)).send(sendObject);
};

describe('Global', () =>  {

  describe('Fields', () =>  {
    it('should filter out fields if passed a `fields` parameter as a comma-separated string', (done) =>  {
      get381Train('381', {'fields': 'number,direction'})
        .expect(200)
        .then((res) =>  {
          _.keys(res.body).should.eql(['direction', 'number']);
          done();
        });
    });

    it('should filter out fields if passed a `fields` parameter as an array', (done) =>  {
      get381Train('381', {'fields': ['number', 'direction']})
        .expect(200)
        .then((res) =>  {
          _.keys(res.body).should.eql(['direction', 'number']);
          done();
        });
    });

    it('should throw an error if none of the fields exist', (done) =>  {
      get381Train('381', {'fields': 'numasdfadber,directiasdfasdon'})
        .expect(400)
        .then((res) =>  {
          res.body.message.match(/fields/);
          done();
        });
    });
  });

});
