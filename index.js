/*!
 * node-slack-mailgun
 * Copyright(c) 2015 Slick Labs, LLC
 * MIT Licensed
 */

 'use strict';

/**
 * Module dependencies.
 * @private
 */

var Debug = require('debug');
var debug = Debug('node-slack-mailgun');
var Slack = require('node-slack');
var mustache = require('mustache');
var verifyMailgun = require('./lib/mailgun-verify');
var mustacheTemplates = require('./lib/templates');
var getTemplate = require('./lib/getTemplate');

/**
 * Module exports.
 */

module.exports = SlackGun;

function SlackGun(options) {
	var that = this;

  // Normalize our options and log/throw any problems.
	that.options = getOptions(options);

  // Initalize node-slack
	that.slack = new Slack(options.slack.hook, options.slack.options);



	return function SlackGunMiddleware(req, res, next) {
    var err = [];

    // Default to trusting the message if we don't
    // have an api key from Mailgun to work with.
    var authentic = true;

    if(that.options.mailgun.apikey) {
      var apikey = that.options.mailgun.apikey;
      var token = req.headers.token;
      var timestamp = req.headers.timestamp;
      var signature = req.headers.signature;

      var verification = verifyMailgun(apikey, token, timestamp, signature);

      if(!verification.valid) {
        authentic = false;
        err.push('Invalid token response. Mailgun message could not be authenticated.');
      }
    }

    if(!req.body) {
      err.push('Unable to get body from Mailgun request.');
    } else {
      var parsedMessage = getMessage(req.body);

      if(parsedMessage) {
        that.slack.send(parsedMessage);
      }
    }

    if(err.length) {
  		// We've hit an error. Let mailgun know 
  		// not to keep hitting us with requests
  		res.writeHead(406, 'Not Acceptable', { 'Content-Type': 'text/html' });
  		res.end();

      err.forEach(function(e) {
        debug(e);
      });
    } else {
      // Great Success!
      // Send response to let mailgun know 
      res.writeHead(200, 'Success', { 'Content-Type': 'text/html' });
      res.end();
    }

	};
};

function getMessage(body, options) {
  debug('Parsing Mailgun message.');

  if(typeof body === 'undefined') {
    debug('Unable to parse message from Mailgun.');
    return false;
  }

  var defaultMessage = {
    channel: '#general',
    username: 'Mailgun',
    icon_emoji: 'mailbox_with_mail',
    unfurl_links: true,
    attachments: []
  };

  if(!body.event) {
    debug('Event type not sent by Mailgun.');
    return false;
  } else if(body.event === 'opened') {
    
  } else if(body.event === 'clicked') {
    
  } else if(body.event === 'unsubscribed') {
    
  } else if(body.event === 'complained') {
    
  } else if(body.event === 'bounced') {
    
  } else if(body.event === 'dropped') {
    
  } else if(body.event === 'delivered') {
    
  } else {
    debug('Unknown event type from Mailgun.');
    return false;
  }
};

function getOptions(options) {

  debug('Setting options');

	if(typeof options === 'undefined') {
    options = {};
  }

  if(typeof options.slack === 'undefined') {
    options.slack = {};
  }

  if(typeof options.mailgun === 'undefined') {
    options.mailgun = {};
  }

  if(!options.slack.hook) {
    throw new Error('You need to set a url for slack communication.');
  }

  if(!options.mailgun.apikey) {
    debug('Not using Mailgun HMAC verification due to lack of an API key.');
  }

  if(!options.slack.options) {
    debug('No options passed to node-slack.');
  }

  return options;

};