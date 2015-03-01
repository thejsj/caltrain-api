/*jshint node:true */

'use strict';
var config = {
  'rethinkdb': {
    'host': 'localhost',
    'port': 28015,
    'db': 'caltrain'
  },
  'ports': {
    'http': 8000
  },
  'url': '127.0.0.1',
  'timeFormat': 'YYYY-MM-DDTHH:MM:SSZ',
};

module.exports = config;