/*jshint node:true */
'use strict';

var trainController = function (req, res) {
  res.json(res.locals.response);
};

module.exports = trainController;