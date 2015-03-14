/*jshint node:true */
'use strict';

var send404 = (req, res) =>  {
  res.status(404).send('404 Not Found');
};

module.exports = send404;