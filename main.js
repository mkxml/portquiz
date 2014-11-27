#! /usr/bin/env node

//NPM module portquiz is a CLI based software which was built on top of the web tool available at http://portquiz.net

'use strict';

// Dependency modules
var program = require("commander");
var colors = require("colors");
var portquiz = require("./lib/portquiz");

program
  .version(require("./package").version)
  .option("-p, --port <n>", "check an specific port number");

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
    portquiz.checkPort(parseInt(program.port, 10)
    , function(port){
      console.log("You can reach services on TCP port " + port + "!");
    }
    , function(err){
      console.log(err);
    });
  }
  catch(e) {
    console.log(e.toString());
  }
}


console.log("You must specify a port or range, use --help for assistance".green);
