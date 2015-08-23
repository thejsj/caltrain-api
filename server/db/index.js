'use strict';
var r = require('rethinkdb');
var config = require('config');

r.connections = [];

r.promise = r.connect(config.get('rethinkdb'))
  .then((conn) => {
    conn.use(config.get('rethinkdb').db);
    return Promise.resolve()
      .then(() => {
        return r.table('stations')
          .indexList()
          .run(conn)
          .then((indexList) => {
            if (indexList.indexOf('slug') === -1) {
              return r.table('stations').indexCreate('slug').run(conn);
            }
            return;
          });
      })
      .then(() => {
        return r.tableCreate('tweets')
          .run(conn)
          .catch(() => {});
      })
      .then(() => {
        return r.table('tweets')
          .indexList()
          .run(conn)
          .then((indexList) => {
            if (indexList.indexOf('number') === -1) {
              return r.table('tweets')
                .indexCreate('created_at')
                .run(conn)
                .catch(() => {});
            }
            return;
          });
      })
      .then(() => {
        return r;
      });
  });
module.exports = r;
