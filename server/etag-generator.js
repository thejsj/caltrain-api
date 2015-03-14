/*jshint node:true */
'use strict';
var crypto = require('crypto');

var etagGenerator = () =>  {
  return (body, encoding) =>  {
    return crypto.createHash('md5').update(body).digest('hex');
  };
};

module.exports = etagGenerator;