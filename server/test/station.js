/*global describe:true, it:true */
/*jshint node:true */
'use strict';
require('should');

var request = require('supertest-as-promised');
var app = require('../index.js');

var _ = require('lodash');
var agent = request.agent(app);

var get22ndStreetStation = (param, sendObject) =>  {
  return agent.get('/v1/station/' + (param || '22nd-street')).send(sendObject);
};

var searchStation = (sendObject) =>  {
  return agent.get('/v1/station/').send(sendObject || { name: 'san' });
};

describe('/station', () =>  {
  var stationUUID;

  describe('/:id_or_slug', () =>  {
    it('should return a json object', (done) =>  {
        get22ndStreetStation()
          .expect(200)
          .then((res) =>  {
            res.body.should.be.an.instanceOf(Object);
            stationUUID = res.body.id;
            done();
          })
          .catch(done);
     });

    it('should a return station when given its id', (done) =>  {
      get22ndStreetStation(stationUUID)
      .expect(200)
      .then((res) =>  {
        res.body.should.be.an.instanceOf(Object);
        res.body.slug.should.be.an.instanceOf(Object);
        res.body.slug.should.equal('22nd-street');
        done();
      })
      .catch(done);
     });

    it('should a return station when given its slug', (done) =>  {
      get22ndStreetStation()
        .expect(200)
        .then((res) =>  {
          res.body.should.be.an.instanceOf(Object);
          res.body.slug.should.equal('22nd-street');
          done();
        })
        .catch(done);
     });
  });

  describe('/', () =>  {
    describe('Name Search', () =>  {
      it('should a return an array or stations when given a name', (done) =>  {
        searchStation({ 'name': 'mountain' })
          .expect(200)
          .then((res) =>  {
            res.body.should.be.an.instanceOf(Array);
            res.body.length.should.equal(1);
            done();
          })
          .catch(done);
      });

      it('should only return stations that have the string as a sub string', (done) =>  {
        searchStation({ 'name': 'san' })
          .expect(200)
          .then((res) =>  {
            res.body.should.be.an.instanceOf(Array);
            res.body.length.should.equal(9);
            res.body.forEach((row) =>  {
              row.name.toLowerCase().match('san').length.should.not.equal(0);
            });
            done();
          })
          .catch(done);
      });
      it('should return an array of length `0` when an irrelevant string is provided', (done) =>  {
        searchStation({ 'name': 'asdfasfaeresrsdd' })
          .expect(200)
          .then((res) =>  {
            res.body.should.be.an.instanceOf(Array);
            res.body.length.should.equal(0);
            done();
          })
          .catch(done);
      });
    });

    describe('Geolocation Search', () =>  {
      it('should a return an array of stations when given a longitude and latitude', (done) =>  {
        get22ndStreetStation('san-francisco')
          .then((res) =>  {
            var station = res.body;
            return searchStation({
              'longitude': station.coordinates.longitude,
              'latitude': station.coordinates.latitude
            })
              .expect(200)
              .then((res) =>  {
                res.body.should.be.instanceOf(Array);
                res.body.forEach((row) =>  {
                  row.should.have.property('distance');
                });
                done();
              });
          })
         .catch(done);
      });

      it('should return an array of stations in order of distance', (done) =>  {
        get22ndStreetStation('san-francisco')
          .then((res) =>  {
            var station = res.body;
            return searchStation({
              'longitude': station.coordinates.longitude,
              'latitude': station.coordinates.latitude
            })
              .expect(200)
              .then((res) =>  {
                var names = _.pluck(res.body, 'slug');
                res.body.forEach((row, i) =>  {
                  if (i > 0) {
                    row.distance.should.be.above(res.body[i - 1].distance);
                  }
                });
                names[0].should.equal('san-francisco');
                names[1].should.equal('22nd-street');
                names[2].should.equal('bayshore');
                names[3].should.equal('so-san-francisco');
                names[4].should.equal('san-bruno');
                names[5].should.equal('millbrae');
                names[6].should.equal('broadway');
                names[7].should.equal('burlingame');
                names[8].should.equal('san-mateo');
                names[9].should.equal('hayward-park');
                names[10].should.equal('hillsdale');
                done();
              });
          })
          .catch(done);
      });

      it('should return a 400 error if bad longitude is given', (done) =>  {
        return searchStation({
          'longitude': '-180.18202',
          'latitude': '37.45418'
        })
          .expect(400)
          .then((res) =>  {
            res.body.message.should.match(/longitude/);
            done();
          })
          .catch(done);
      });

      it('should return a 400 error if bad longitude is given', (done) =>  {
            return searchStation({
              'longitude': '-120.18202',
              'latitude': 'asdfasd'
            })
              .expect(400)
              .then((res) =>  {
                res.body.message.should.match(/latitude/);
                done();
              })
              .catch(done);
      });
    });
  });

});