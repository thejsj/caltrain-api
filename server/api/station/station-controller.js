/*jshint node:true */
'use strict';

var stationController = function (req, res) {
  res.json(res.locals.response);
};

module.exports = stationController;