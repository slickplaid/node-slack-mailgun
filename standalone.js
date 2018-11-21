#!/usr/bin/env node
'use strict';


var commander = require('commander');
var fs = require('fs');
var pkgjson = fs.readFileSync('./package.json', 'utf8');
var pkg = JSON.parse(pkgjson);
var version = pkg.version;

var hook = false;
commander
  .version(version)
  .option('-p, --port [port]', 'Specify Port to Listen On. Default: <3000>', 3000)
  .option('-h, --hostname [ip]', 'Specify hostname to Listen On. Default: <0.0.0.0>')
  .option('-u, --url [url]', 'Specify URL Endpoint. Default: </>', '/')
  .option('-m, --mailgun [apikey]', 'Specify mailgun API key')
  .option('-v, --verbose', 'Turn on verbose error debugging.')
  .arguments('<hook>')
  .action(function(slackhook) {
    if(!slackhook) {
      throw new Error('You must specify a Slack hook URL.');
      //process.exit(1);
    }
    hook = slackhook;
  })
  .parse(process.argv);

if(!process.argv.slice(2).length) {
  commander.outputHelp();
  process.exit(1);
}

if(commander.verbose) {
  process.env.DEBUG = 'node-slack-mailgun';
}

var express = require('express');
var bodyParser = require('body-parser');
var slackgun = require('./index');
var app = express();

app.use(commander.url, bodyParser.json({
  limit: '100mb'
}));

app.post(commander.url, slackgun({
  slack: {
    hook: hook
  },
  mailgun: {
    apikey: commander.apikey
  },
  templates: {
    opened: true,
    clicked: true,
    unsubscribed: true,
    complained: true,
    bounced: true,
    dropped: true,
    delivered: true,
    all: true
  }
}));

app.listen(commander.port, commander.hostname, function() {
  var host = commander.hostname || '0.0.0.0';
  var url = commander.url || '/';
  var port = commander.port || 3000;
  var fullurl = 'http://'+host+':'+port+url;
  // eslint-disable-next-line
  console.log('SlackGun listening on '+fullurl);
});