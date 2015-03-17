/*global describe:true */
/*jshint node:true */
'use strict';
require('babel/register');
require('should');

describe('API', () =>  {
  require('./parser');
  require('./station');
  require('./train');
  require('./global');
  require('./meta');
});