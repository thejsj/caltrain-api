'use strict';
var r = require('rethinkdb');
var config = require('config');

r.connections = [];

r.promise = r.connect(config.get('rethinkdb'))
  .then((conn) => {
    r.conn = conn;
    r.conn.use(config.get('rethinkdb').db);
    return r;
  })
  .then(() => {
    return r.table('stations')
      .indexList()
      .run(r.conn)
      .then((indexList) => {
        if (indexList.indexOf('slug') === -1) {
          return r.table('stations').indexCreate('slug').run(r.conn);
        }
        return;
      });
  })
  .then(() => {
    return r.tableCreate('tweets')
      .run(r.conn)
      .catch(() => {});
  })
  .then(() => {
    return r.table('tweets')
      .indexList()
      .run(r.conn)
      .then((indexList) => {
        if (indexList.indexOf('number') === -1) {
          return r.table('tweets')
            .indexCreate('created_at')
            .run(r.conn)
            .catch(() => {});
        }
        return;
      });
  })
  .then(() => {
    return r;
  });

module.exports = r;
