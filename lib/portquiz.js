/*
 *
 * https://github.com/mkautzmann/portquiz
 *
 * Copyright (c) 2014 Matheus Kautzmann
 * Licensed under the MIT license.
 */

"use strict";

var http = require("http");

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
    successCallback.apply(this, [port]);
  });

  request.on("socket", function(socket){
    socket.setTimeout(1000);
    socket.on('timeout', function() {
      request.abort();
    });
  });

  if(!hideError) {
    request.on("error", function() {
      if(port === 25 || port === 22) {
        errorCallback.apply(this, ["You may reach content on port" + port + ", but portquiz.net doesn't support that port."]);
      }
      else {
        errorCallback.apply(this, ["It looks like you can't reach services on TCP port " + port + "."]);
      }
    });
  }

  request.end();
};
