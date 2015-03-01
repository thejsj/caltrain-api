/*jshint node:true */
'use strict';

var send404 = function (req, res) {
  res.status(404).send('404 Not Found');
};

module.exports = send404;