//Test file for portquiz using Mocha + Chai

"use strict";
var expect = require("chai").expect,
  sinon = require("sinon"),
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

  describe("when testing with a range of ports", function(){
    it("should check if the start argument is a valid number", function(){
      expect(function(){
        portquiz.checkRange("test", 2);
      }).to.throw("The start and end arguments must be a valid number");
    });
    it("should check if the end argument is a valid number", function(){
      expect(function(){
        portquiz.checkRange(2, "test");
      }).to.throw("The start and end arguments must be a valid number");
    });
    it("should check if the range is valid and the start port is lower than the end port", function(){
      expect(function(){
        portquiz.checkRange(2, 1);
      }).to.throw("You must provide a valid range");
    });
    it("should report successful the ports that are available", function(done){
      portquiz.checkRange(80, 81, function(){
        done();
      });
    });
    it("should hide the errors", function(){
      var callback = sinon.spy();
      portquiz.checkRange(22, 25, function(){
        expect(callback.called).to.be.true();
      }, callback);
    });
  });
});
