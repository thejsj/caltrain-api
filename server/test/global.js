/*global describe:true, it:true */
/*jshint node:true */
'use strict';
require('should');
var request = require('supertest-as-promised');
var _ = require('lodash');

var app = require('../index.js');
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

  xdescribe('Time Format', () =>  {

    it('should return the time in minutes if `timeFormat` is passed as `minutes`', (done) =>  {
      var now = new Date(Date.now());
      get381Train('381', {'timeFormat': 'minutes', 'departure': now.toJSON() })
        .expect(200)
        .then((res) =>  {
          _.each(res.body.stations, (day) =>  {
            _.each(day, (train) =>  {
              train.should.be.instanceOf(Number);
              var time = getTimeFromMinutes(train);
              time.should.match(/[0-9]{1,2}:[0-9]{2}/);
            });
          });
          done();
        });
    });

  });

});