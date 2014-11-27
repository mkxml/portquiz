/*global describe,it*/
'use strict';
var assert = require('assert'),
  portquiz = require('../lib/portquiz.js');

describe('portquiz node module.', function() {
  it('must be awesome', function() {
    assert( portquiz.awesome(), 'awesome');
  });
});
