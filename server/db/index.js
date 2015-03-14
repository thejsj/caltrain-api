/*jshint node:true */
'use strict';
var r = require('rethinkdb');
var config = require('config');

r.connections = [];

r.connect(config.get('rethinkdb'))
  .then((conn) =>  {
    r.conn = conn;
    r.conn.use(config.get('rethinkdb').db);
    return r;
  })
  .then(() =>  {
    return r.table('stations')
      .indexList()
      .run(r.conn)
      .then((indexList) =>  {
        if (indexList.indexOf('slug') === -1) {
          return r.table('stations').indexCreate('slug').run(r.conn);
        }
        return;
      });
  })
  .then(() =>  {
    return r.table('trains')
      .indexList()
      .run(r.conn)
      .then((indexList) =>  {
        if (indexList.indexOf('number') === -1) {
          return r.table('trains').indexCreate('number').run(r.conn);
        }
        return;
      });
  });

module.exports = r;