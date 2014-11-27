//Test file for portquiz using Mocha + Chai

"use strict";
var expect = require("chai").expect,
  portquiz = require("../lib/portquiz.js");

describe("portquiz", function() {

  describe("when checking if arguments are valid", function() {
    it("should not accept non numeric arguments as ports", function() {
      expect(function() {
        portquiz.checkPort("test");
      }).to.throw("The port argument must be a valid number");
    });
    it("should not accept port 0", function(){
      expect(function() {
        portquiz.checkPort(0);
      }).to.throw("Port number must be between 1 and 65535");
    });
    it("should not accept larger than the range [1-65535]", function() {
      expect(function(){
        portquiz.checkPort(65536);
      }).to.throw("Port number must be between 1 and 65535");
    });
  });

  describe("when testing a single port", function() {
    it("should be successful if the port is reachable", function(done) {
      portquiz.checkPort(80, function() {
        done();
      }, function(err){
        throw new Error(err);
      });
    });
    it("should fail if the port can't be reached", function(done) {
      portquiz.checkPort(22, function() {
        throw new Error("Success when testing failure, testing with port 22");
      },
      function() {
        done();
      });
    });
  });
});
