#! /usr/bin/env node

//NPM module portquiz is a CLI based software which was built on top of the web tool available at http://portquiz.net

'use strict';

// Dependency modules
var program = require("commander");
var colors = require("colors");
var portquiz = require("./lib/portquiz");
var pkg = require("./package");

program
  .version(pkg.version)
  .option("-p, --port <n>", "check an specific port number")
  .option("-s, --start <n>", "start port to use when checking for range")
  .option("-e, --end <n>", "end port to use when checking for range");

program.on('--help', function(){
  console.log("  This software tests for outbound port connection".blue);
  console.log("  It can be used to test which port you could use to connect to a web service");
  console.log("  Currently this software accepts only " + "TCP".underline.white + " ports");
  console.log("  Powered by portquiz.net, it may not work if access to portquiz.net is blocked".red);
  console.log("  Ports 22 and 25 are not tested because portquiz.net uses them!".yellow);
});

program.parse(process.argv);

if(program.port) {
  try {
    portquiz.checkPort(parseInt(program.port, 10), function(port){
      var msg = "You can reach services on TCP port " + port + "!";
      console.log(msg.green);
    }, function(err){
      console.log(err.red);
    });
  }
  catch(e) {
    console.log(e.toString().red);
  }
}
else if(program.start && program.end) {
  try {
    portquiz.checkRange(parseInt(program.start, 10), parseInt(program.end, 10), function(msg){
      console.log(msg.green);
    })
  }
  catch(e) {
    console.log(e.toString().red);
  }
}
else {
  console.log("You must specify a port OR range, use --help for assistance".green);
}
