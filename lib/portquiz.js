/*
 *
 * https://github.com/mkautzmann/portquiz
 *
 * Copyright (c) 2014 Matheus Kautzmann
 * Licensed under the MIT license.
 */

"use strict";

var http = require("http");

http.globalAgent.maxSockets = Infinity;

exports.checkPort = function(port, successCallback, errorCallback, hideError) {

  if(typeof port !== "number" || isNaN(port)) {
    throw new Error("The port argument must be a valid number");
  }

  if(port < 1 || port > 65535) {
    throw new Error("Port number must be between 1 and 65535");
  }

  var options = {
    hostname: "portquiz.net",
    port: port,
    path: "/",
    method: "GET"
  };

  var request = http.request(options, function() {
    if(successCallback) {
      successCallback.apply(this, [port]);
    }
  });

  request.on("socket", function(socket){
    socket.setTimeout(1000);
    socket.on('timeout', function() {
      request.abort();
    });
  });

  if(!hideError) {
    request.on("error", function() {
      if(errorCallback) {
        if(port === 25 || port === 22) {
          errorCallback.apply(this, ["You may reach content on port " + port + ", but portquiz.net doesn't support that port."]);
        }
        else {
          errorCallback.apply(this, ["It looks like you can't reach services on TCP port " + port + "."]);
        }
      }
    });
  }

  request.end();
};

exports.checkRange = function(start, end, successCallback) {
  if((typeof start !== "number" || isNaN(start)) || (typeof end !== "number" || isNaN(end))) {
    throw new Error("The start and end arguments must be a valid number");
  }

  if(start >= end) {
    throw new Error("You must provide a valid range");
  }

  // Solving the problem of too much checks hanging and causing open file limit related problems, so here we are chunking the batch of checks.
  var chunkSize = 256;

  //var numChunks = Math.ceil(total/chunkSize);

  var currentChunk = 1;

  var total = (end - start) + 1;

  var self = this;

  var count = 0;

  var successCount = 0;

  var checkChunk = function() {
    for(var l = (chunkSize*currentChunk); start <= l; start++) {
      self.checkPort(start, report, ackPort);
      if(start === end) {
        break;
      }
    }
  };

  var ackPort = function() {
    count++;
    if(count === total) {
      successCallback.apply(this, ["Port range scan finished! " + successCount + " ports open."]);
    }
    if(count === (chunkSize*currentChunk)) {
      currentChunk++;
      checkChunk();
    }
  };

  var report = function(port){
    var msg = "You can reach services on TCP port " + port + "!";
    console.log(msg);
    successCount++;
    ackPort();
  };

  checkChunk();
};
