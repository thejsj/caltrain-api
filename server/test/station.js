/*global describe:true, it:true */
/*jshint node:true */
'use strict';
require('should');
var request = require('supertest-as-promised');
var app = require('../index.js');
var agent = request.agent(app);

describe('/stations', function () {
    it('should return an array with train information', function () {
      agent
        .get('/api/file/')
        .send({
          projectName: projectName,
        })
        .expect(200)
        .then(function (res) {
          var fileStructure = res.body;
          expect(fileStructure.files).to.be.a('object');
          done();
        })
        .catch(function (err) {
          throw new Error(err);
          done();
        });
    });
  });