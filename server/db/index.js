/*jshint node:true */
'use strict';
var r = require('rethinkdb');
var config = require('config');
r.connections = [];

r.connect(config.get('rethinkdb'))
  .then(function (conn) {
    r.conn = conn;
    r.conn.use(config.get('rethinkdb').db);
    return r;
  })
  .then(function () {
    return r.table('stations')
      .indexList()
      .run(r.conn)
      .then(function (indexList) {
        if (indexList.indexOf('slug') === -1) {
          return r.table('stations').indexCreate('slug').run(r.conn);
        }
        return;
      });
  })
  .then(function () {
    return r.table('trains')
      .indexList()
      .run(r.conn)
      .then(function (indexList) {
        if (indexList.indexOf('number') === -1) {
          return r.table('trains').indexCreate('number').run(r.conn);
        }
        return;
      });
  });

module.exports = r;