/*jshint node:true */
'use strict';
var _ = require('lodash');
/**
 * Take the arguments in the function and make a recursive object out of them
 * Ex: 1, 2, 3 -> {1: {2: 3}}
 */
var arrayToObject = function () {
  var args = _.toArray(arguments);
  if (args.length < 2) throw new Error('At least two arguments needed');
  var obj = { };
  obj[args[args.length - 2]] = args[args.length - 1];
  if (args.length === 2) return obj;
  for (var i = args.length - 3; i >= 0; i -= 1) {
    var copy = {};
    copy[i] = _.clone(obj);
    obj = copy;
  }
  return obj;
};

module.exports = arrayToObject;