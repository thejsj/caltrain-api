/*global describe:true, it:true */
/*jshint node:true */
'use strict';
require('should');
var request = require('supertest-as-promised');
var _ = require('lodash');
var moment = require('moment');

var app = require('../index.js');

var agent = request.agent(app);

var get381Train = (param, sendObject) =>  {
  return agent.get('/v1/train/' + (param || 381)).send(sendObject);
};

var searchTrains = (sendObject) =>  {
  return agent.get('/v1/train/').send(sendObject || { from: '22nd-street' });
};

var arrivalTimeTest = (done, timeString, res) =>  {
  var arrivalTime = moment(new Date(timeString));
  res.body.length.should.be.above(0);
  res.body.forEach((train) =>  {
    train.stations.should.not.equal(undefined);
    arrivalTime.isAfter(train.stations['22nd-street']);
  });
  done();
  return res;
};

var departureTimeTest = (done, timeString, res) =>  {
  var departureTime = moment(new Date(timeString));
  res.body.length.should.be.above(0);
  res.body.forEach((train) =>  {
    train.stations.should.not.equal(undefined);
    departureTime.isBefore(train.stations['22nd-street']);
  });
  done();
  return res;
};

describe('/train', () =>  {
  describe('/:id_or_number', () =>  {
    var trainId;
    it('should return a json object', (done) =>  {
      get381Train()
        .expect(200)
        .then((res) =>  {
          res.body.should.be.an.instanceOf(Object);
          res.body.number.should.be.an.instanceOf(Number);
          trainId = res.body.id;
          done();
        })
        .catch(done);
    });

    it('should return the train specified by the ID', (done) =>  {
      get381Train(trainId)
        .expect(200)
        .then((res) =>  {
          res.body.should.be.an.instanceOf(Object);
          res.body.number.should.equal(381);
          done();
        })
        .catch(done);
    });

    it('should return the train specified by the number (Number)', (done) =>  {
      get381Train(381)
        .expect(200)
        .then((res) =>  {
          res.body.should.be.an.instanceOf(Object);
          res.body.number.should.equal(381);
          done();
        })
        .catch(done);
    });

   it('should return the train specified by the number (Number)', (done) =>  {
      get381Train('381')
        .expect(200)
        .then((res) =>  {
          res.body.should.be.an.instanceOf(Object);
          res.body.number.should.equal(381);
          done();
        })
        .catch(done);
    });
  });

  describe('/', () =>  {
    var weekdayMorningTimeString = 'Tue Mar 03 2015 08:17:43 GMT-0800 (PST)';
    var weekdayEveningTimeString = 'Wed Mar 04 2015 20:42:37 GMT-0800 (PST)';
    var saturdayTimeString = 'Sat Mar 07 2015 20:42:37 GMT-0800 (PST)';
    var sundayTimeString = 'Sun Mar 08 2015 20:42:37 GMT-0800 (PST)';

    it('should return an array', (done) =>  {
      searchTrains()
        .expect(200)
        .then((res) =>  {
          res.body.should.be.an.instanceOf(Array);
          done();
        })
        .catch(done);
    });

    describe('From and To', () =>  {

      it('should only return trains that pass through the `from` station', (done) =>  {
        searchTrains({'from': '22nd-street'})
          .then((res) =>  {
            res.body.forEach((train) =>  {
              _.some(_.keys(train.stations), (stationName) =>  {
                return stationName === '22nd-street';
              }).should.equal(true);
            });
            done();
          })
          .catch(done);
      });

      it('should only return trains that pass through the `from` station with a departure time', (done) =>  {
        searchTrains({'from': '22nd-street', 'departure': weekdayMorningTimeString})
          .then((res) =>  {
            res.body.forEach((train) =>  {
              _.some(_.keys(train.stations), (stationName) =>  {
                return stationName === '22nd-street';
              }).should.equal(true);
            });
            done();
          })
          .catch(done);
      });

      it('should only return trains that pass through the `from` station and `to` station heading south', (done) =>  {
        searchTrains({
          'from': '22nd-street',
          'to': 'mountain-view',
          'departure': weekdayMorningTimeString
        })
          .then((res) =>  {
            res.body.length.should.be.above(0);
            res.body.forEach((train) =>  {
              _.some(_.keys(train.stations), (stationName) =>  {
                return stationName === '22nd-street';
              }).should.equal(true);
              _.some(_.keys(train.stations), (stationName) =>  {
                return stationName === 'mountain-view';
              }).should.equal(true);
              train.direction.should.equal('south');
            });
            done();
          })
          .catch(done);
      });

      it('should only return trains that pass through the `from` station and `to` station heading north', (done) =>  {
        searchTrains({
          'from': 'mountain-view',
          'to': '22nd-street',
          'departure': weekdayMorningTimeString
        })
          .then((res) =>  {
            res.body.length.should.be.above(0);
            res.body.forEach((train) =>  {
              _.some(_.keys(train.stations), (stationName) =>  {
                return stationName === '22nd-street';
              }).should.equal(true);
              _.some(_.keys(train.stations), (stationName) =>  {
                return stationName === 'mountain-view';
              }).should.equal(true);
              train.direction.should.equal('north');
            });
            done();
          })
          .catch(done);
      });
    });

    describe('Departure', () =>  {
      var departureTime = moment(new Date(weekdayEveningTimeString));
      it('should only get trains that depart after the arrival time on weekdays', (done) =>  {
        searchTrains({
          'from': '22nd-street',
          'to': 'mountain-view',
          'departure': weekdayEveningTimeString
        })
          .then((res) =>  {
            res.body.length.should.be.above(0);
            res.body.forEach((train) =>  {
              var time = moment(train.stations['22nd-street']);
              departureTime.isBefore(time).should.equal(true);
            });
            done();
          })
          .catch(done);
        });

      it('should only get trains that depart after the arrival time on Saturdays', (done) =>  {
        searchTrains({
          'from': '22nd-street',
          'to': 'mountain-view',
          'departure': saturdayTimeString
        })
          .then((res) =>  {
            var departureTime = moment(new Date(saturdayTimeString));
            res.body.length.should.be.above(0);
            res.body.forEach((train) =>  {
              train.stations.should.not.equal(undefined);
              departureTime.isBefore(train.stations['22nd-street']);
            });
            done();
          })
          .catch(done);

      });
      it('should only get trains that depart after the arrival time on Sundays', (done) =>  {
        searchTrains({
          'from': '22nd-street',
          'to': 'mountain-view',
          'departure': sundayTimeString
        })
          .then((res) =>  {
            var departureTime = moment(new Date(sundayTimeString));
            res.body.length.should.be.above(0);
            res.body.forEach((train) =>  {
              train.stations.should.not.equal(undefined);
              departureTime.isBefore(train.stations['22nd-street']);
            });
            done();
          })
          .catch(done);
      });

      it('it should throw an error if a `departure` is specified and no `from` is specified', (done) => {
        return searchTrains({
          'to': 'mountain-view',
          'departure': weekdayEveningTimeString
        })
          .expect(400)
          .then((res) => {
            res.body.message.should.match(/departure/);
            res.body.message.should.match(/from/);
            done();
          })
          .catch(done);
      });
    });

   describe('Arrival', () => {

      it('should only get trains that depart after the arrival time on weekdays', (done) => {
        searchTrains({
          'from': '22nd-street',
          'to': 'mountain-view',
          'arrival': weekdayEveningTimeString
        })
          .then((res) => {
            var arrivalTime = moment(new Date(weekdayEveningTimeString));
            res.body.length.should.be.above(0);
            res.body.forEach((train) => {
              arrivalTime.isAfter(train.stations['22nd-street']);
            });
            done();
          })
          .catch(done);
        });

      it('should only get trains that depart after the arrival time on Saturdays', (done) => {
        searchTrains({
          'from': '22nd-street',
          'to': 'mountain-view',
          'arrival': saturdayTimeString
        })
          .then((res) =>  {
            var arrivalTime = moment(new Date(saturdayTimeString));
            res.body.length.should.be.above(0);
            res.body.forEach((train) =>  {
              train.stations.should.not.equal(undefined);
              arrivalTime.isAfter(train.stations['22nd-street']);
            });
            done();
          })
          .catch(done);
        });

      it('should only get trains that depart after the arrival time on Sundays', (done) =>  {
        searchTrains({
          'from': '22nd-street',
          'to': 'mountain-view',
          'arrival': sundayTimeString
        })
          .then((res) =>  {
            var arrivalTime = moment(new Date(sundayTimeString));
            res.body.length.should.be.above(0);
            res.body.forEach((train) =>  {
              train.stations.should.not.equal(undefined);
              arrivalTime.isAfter(train.stations['22nd-street']);
            });
            done();
          })
          .catch(done);
        });

        it('it should throw an error if a `arrival` is specified and no `to` is specified', (done) =>  {
          return searchTrains({
            'from': 'mountain-view',
            'arrival': weekdayEveningTimeString
          })
            .expect(400)
            .then((res) =>  {
              res.body.message.should.match(/arrival/);
              res.body.message.should.match(/to/);
              done();
            })
            .catch(done);
        });
    });

    describe('Time Formats', () =>  {
      var departureTestTime = new Date('Mon Mar 09 2015 08:35:41 GMT-0700 (PDT)');
      var arrivalTestTime = new Date('Mon Mar 09 2015 22:35:41 GMT-0700 (PDT)');
      var __done__ = () =>  {};

      it('should accept ISO8601 timestamps for `departure` and `arrival`', (done) =>  {
        searchTrains({
          'from': '22nd-street',
          'to': 'mountain-view',
          'departure': departureTestTime.toString(),
          'arrival': arrivalTestTime.toString()
        })
          .then(arrivalTimeTest.bind(null, __done__, arrivalTestTime.toString()))
          .then(departureTimeTest.bind(null, done, departureTestTime.toString()))
          .catch(done);
      });

      it('should accept UNIX timestamps (with milliseconds) for `departure` and `arrival`', (done) =>  {
        searchTrains({
          'from': '22nd-street',
          'to': 'mountain-view',
          'departure': +(departureTestTime),
          'arrival': +(arrivalTestTime)
        })
          .then(arrivalTimeTest.bind(null, __done__, arrivalTestTime.toString()))
          .then(departureTimeTest.bind(null, done, departureTestTime.toString()))
          .catch(done);
      });

      it('should accept GMT Time string for `departure` and `arrival`', (done) =>  {
        searchTrains({
          'from': '22nd-street',
          'to': 'mountain-view',
          'departure': departureTestTime.toGMTString(),
          'arrival': arrivalTestTime.toGMTString()
        })
          .then(arrivalTimeTest.bind(null, __done__, arrivalTestTime.toString()))
          .then(departureTimeTest.bind(null, done, departureTestTime.toString()))
          .catch(done);
      });

      it('should accept JSON Time string for `departure` and `arrival`', (done) =>  {
        searchTrains({
          'from': '22nd-street',
          'to': 'mountain-view',
          'departure': departureTestTime.toJSON(),
          'arrival': arrivalTestTime.toJSON()
        })
          .then(arrivalTimeTest.bind(null, __done__, arrivalTestTime.toString()))
          .then(departureTimeTest.bind(null, done, departureTestTime.toString()))
          .catch(done);
      });

      it('should throw an error if a UNIX timestamps is passed that is before the year 2000', (done) =>  {
        searchTrains({
          'from': '22nd-street',
          'to': 'mountain-view',
          'departure': +(departureTestTime) / 1000,
          'arrival': +(arrivalTestTime) / 1000
        })
          .expect(400)
          .then((res) =>  {
            res.body.message.should.match(/UNIX/);
            res.body.message.should.match(/2000/);
            done();
          })
          .catch(done);
      });

    });

    describe('Train Type Filter', () =>  {

      it('should only get `express` trains when requested', (done) =>  {
        searchTrains({
          'from': '22nd-street',
          'to': 'mountain-view',
          'type': 'express'
        })
          .then((res) =>  {
            res.body.length.should.be.above(0);
            res.body.forEach((train) =>  {
              train.type.should.equal('express');
            });
            done();
          })
          .catch(done);
      });

      it('should only get `express` and `limited` trains when requested', (done) =>  {
        searchTrains({
          'from': '22nd-street',
          'to': 'mountain-view',
          'type': 'express, limited'
        })
          .then((res) =>  {
            res.body.length.should.be.above(0);
            res.body.forEach((train) =>  {
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