/*global describe:true, it:true, xit:true */
/*jshint node:true */
'use strict';
require('should');
var request = require('supertest-as-promised');
var _ = require('lodash');
var moment = require('moment');

var app = require('../index.js');
var getWeekday = require('../utils').getWeekday;
var getTimeFromMinutes = require('../utils').getTimeFromMinutes;
var getMinutesFromTime = require('../utils').getMinutesFromTime;

var agent = request.agent(app);

var get381Train = function (param, sendObject) {
  return agent.get('/v1/train/' + (param || 381)).send(sendObject);
};

var searchTrains = function (sendObject) {
  return agent.get('/v1/train/').send(sendObject || { from: '22nd-street' });
};

describe('/train', function () {
  describe('/:id_or_number', function () {
    var trainId;
    it('should return a json object', function (done) {
      get381Train()
        .expect(200)
        .then(function (res) {
          res.body.should.be.an.instanceOf(Object);
          res.body.number.should.be.an.instanceOf(Number);
          trainId = res.body.id;
          done();
        })
        .catch(done);
    });

    it('should return the train specified by the ID', function (done) {
      get381Train(trainId)
        .expect(200)
        .then(function (res) {
          res.body.should.be.an.instanceOf(Object);
          res.body.number.should.equal(381);
          done();
        })
        .catch(done);
    });

    it('should return the train specified by the number (Number)', function (done) {
      get381Train(381)
        .expect(200)
        .then(function (res) {
          res.body.should.be.an.instanceOf(Object);
          res.body.number.should.equal(381);
          done();
        })
        .catch(done);
    });

   it('should return the train specified by the number (Number)', function (done) {
      get381Train('381')
        .expect(200)
        .then(function (res) {
          res.body.should.be.an.instanceOf(Object);
          res.body.number.should.equal(381);
          done();
        })
        .catch(done);
    });
  });

  describe('/', function () {
    var weekdayMorningTimeString = 'Tue Mar 03 2015 08:17:43 GMT-0800 (PST)';
    var weekdayEveningTimeString = 'Wed Mar 04 2015 20:42:37 GMT-0800 (PST)';
    var saturdayTimeString = 'Sat Mar 07 2015 20:42:37 GMT-0800 (PST)';
    var sundayTimeString = 'Sun Mar 08 2015 20:42:37 GMT-0800 (PST)';

    it('should return an array', function (done) {
      searchTrains()
        .expect(200)
        .then(function (res) {
          res.body.should.be.an.instanceOf(Array);
          done();
        })
        .catch(done);
    });

    describe('From and To', function () {

      it('should only return trains that pass through the `from` station', function (done) {
        searchTrains({'from': '22nd-street'})
          .then(function (res) {
            res.body.forEach(function (train) {
              _.some(_.keys(train.stations.weekday), function (stationName) {
                return stationName === '22nd-street';
              }).should.equal(true);
            });
            done();
          })
          .catch(done);
      });

      it('should only return trains that pass through the `from` station with a departure time', function (done) {
        searchTrains({'from': '22nd-street', 'departure': weekdayMorningTimeString})
          .then(function (res) {
            res.body.forEach(function (train) {
              _.some(_.keys(train.stations.weekday), function (stationName) {
                return stationName === '22nd-street';
              }).should.equal(true);
            });
            done();
          })
          .catch(done);
      });

      it('should only return trains that pass through the `from` station and `to` station heading south', function (done) {
        searchTrains({
          'from': '22nd-street',
          'to': 'mountain-view',
          'departure': weekdayMorningTimeString
        })
          .then(function (res) {
            res.body.length.should.be.above(0);
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
          })
          .catch(done);
      });

      it('should only return trains that pass through the `from` station and `to` station heading north', function (done) {
        searchTrains({
          'from': 'mountain-view',
          'to': '22nd-street',
          'departure': weekdayMorningTimeString
        })
          .then(function (res) {
            res.body.length.should.be.above(0);
            res.body.forEach(function (train) {
              _.some(_.keys(train.stations.weekday), function (stationName) {
                return stationName === '22nd-street';
              }).should.equal(true);
              _.some(_.keys(train.stations.weekday), function (stationName) {
                return stationName === 'mountain-view';
              }).should.equal(true);
              train.direction.should.equal('north');
            });
            done();
          })
          .catch(done);
      });
    });

    describe('Departure', function () {
      var departureTime = moment(new Date(weekdayEveningTimeString));
      it('should only get trains that depart after the arrival time on weekdays', function (done) {
        searchTrains({
          'from': '22nd-street',
          'to': 'mountain-view',
          'departure': weekdayEveningTimeString
        })
          .then(function (res) {
            res.body.length.should.be.above(0);
            res.body.forEach(function (train) {
              var timeInHmm = train.stations[getWeekday(departureTime)]['22nd-street'];
              var time = moment(timeInHmm, 'H:mm');
              departureTime.isBefore(time).should.equal(true);
            });
            done();
          })
          .catch(done);
        });

      it('should only get trains that depart after the arrival time on Saturdays', function (done) {
        searchTrains({
          'from': '22nd-street',
          'to': 'mountain-view',
          'departure': saturdayTimeString
        })
          .then(function (res) {
            var departureTime = moment(new Date(saturdayTimeString));
            var departureTimeInMinutes = getMinutesFromTime(departureTime.format('H'), departureTime.format('m'));
            res.body.length.should.be.above(0);
            res.body.forEach(function (train) {
              train.stations[getWeekday(departureTime)].should.not.equal(undefined);
              var timeInMinutes = getMinutesFromTime.apply(
                null,
                train.stations[getWeekday(departureTime)]['22nd-street'].split(':')
              );
              departureTimeInMinutes.should.be.below(timeInMinutes);
            });
            done();
          })
          .catch(done);

      });
      it('should only get trains that depart after the arrival time on Sundays', function (done) {
        searchTrains({
          'from': '22nd-street',
          'to': 'mountain-view',
          'departure': sundayTimeString
        })
          .then(function (res) {
            var departureTime = moment(new Date(sundayTimeString));
            var departureTimeInMinutes = getMinutesFromTime(departureTime.format('H'), departureTime.format('m'));
            res.body.length.should.be.above(0);
            res.body.forEach(function (train) {
              train.stations[getWeekday(departureTime)].should.not.equal(undefined);
              var timeInMinutes = getMinutesFromTime.apply(
                null,
                train.stations[getWeekday(departureTime)]['22nd-street'].split(':')
              );
              departureTimeInMinutes.should.be.below(timeInMinutes);
            });
            done();
          })
          .catch(done);
      });

      it('it should throw an error if a `departure` is specified and no `from` is specified', function (done) {
        return searchTrains({
          'to': 'mountain-view',
          'departure': weekdayEveningTimeString
        })
          .expect(400)
          .then(function (res) {
            res.body.message.should.match(/departure/);
            res.body.message.should.match(/from/);
            done();
          })
          .catch(done);
      });
    });

   describe('Arrival', function () {

      it('should only get trains that depart after the arrival time on weekdays', function (done) {
        searchTrains({
          'from': '22nd-street',
          'to': 'mountain-view',
          'arrival': weekdayEveningTimeString
        })
          .then(function (res) {
            var arrivalTime = moment(new Date(weekdayEveningTimeString));
            var arrivalTimeInMinutes = getMinutesFromTime(arrivalTime.format('H'), arrivalTime.format('m'));
            res.body.length.should.be.above(0);
            res.body.forEach(function (train) {
              train.stations[getWeekday(arrivalTime)].should.not.equal(undefined);
              var timeInMinutes = getMinutesFromTime.apply(
                null,
                train.stations[getWeekday(arrivalTime)]['22nd-street'].split(':')
              );
              arrivalTimeInMinutes.should.be.above(timeInMinutes);
            });
            done();
          })
          .catch(done);
        });

      it('should only get trains that depart after the arrival time on Saturdays', function (done) {
        searchTrains({
          'from': '22nd-street',
          'to': 'mountain-view',
          'arrival': saturdayTimeString
        })
          .then(function (res) {
            var arrivalTime = moment(new Date(saturdayTimeString));
            var arrivalTimeInMinutes =
              getMinutesFromTime(arrivalTime.format('H'), arrivalTime.format('m'));
            res.body.length.should.be.above(0);
            res.body.forEach(function (train) {
              train.stations[getWeekday(arrivalTime)].should.not.equal(undefined);
              var timeInMinutes = getMinutesFromTime.apply(
                null,
                train.stations[getWeekday(arrivalTime)]['22nd-street'].split(':')
              );
              arrivalTimeInMinutes.should.be.above(timeInMinutes);
            });
            done();
          })
          .catch(done);
        });

      it('should only get trains that depart after the arrival time on Sundays', function (done) {
        searchTrains({
          'from': '22nd-street',
          'to': 'mountain-view',
          'arrival': sundayTimeString
        })
          .then(function (res) {
            var arrivalTime = moment(new Date(sundayTimeString));
            var arrivalTimeInMinutes = getMinutesFromTime(arrivalTime.format('H'), arrivalTime.format('m'));
            res.body.length.should.be.above(0);
            res.body.forEach(function (train) {
              train.stations[getWeekday(arrivalTime)].should.not.equal(undefined);
              var timeInMinutes = getMinutesFromTime.apply(
                null,
                train.stations[getWeekday(arrivalTime)]['22nd-street'].split(':')
              );
              arrivalTimeInMinutes.should.be.above(timeInMinutes);
            });
            done();
          })
          .catch(done);
        });

        it('it should throw an error if a `arrival` is specified and no `to` is specified', function (done) {
          return searchTrains({
            'from': 'mountain-view',
            'arrival': weekdayEveningTimeString
          })
            .expect(400)
            .then(function (res) {
              res.body.message.should.match(/arrival/);
              res.body.message.should.match(/to/);
              done();
            })
            .catch(done);
        });
    });

    describe('Train Type Filter', function () {

      it('should only get `express` trains when requested', function (done) {
        searchTrains({
          'from': '22nd-street',
          'to': 'mountain-view',
          'type': 'express'
        })
          .then(function (res) {
            res.body.length.should.be.above(0);
            res.body.forEach(function (train) {
              train.type.should.equal('express');
            });
            done();
          })
          .catch(done);
      });

      it('should only get `express` and `limited` trains when requested', function (done) {
        searchTrains({
          'from': '22nd-street',
          'to': 'mountain-view',
          'type': 'express, limited'
        })
          .then(function (res) {
            res.body.length.should.be.above(0);
            res.body.forEach(function (train) {
              true.should.equal(
                train.type === 'express' || train.type === 'limited'
              );
            });
            done();
          })
          .catch(done);
      });
    });
  });
});