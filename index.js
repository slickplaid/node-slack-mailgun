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
//process.env.DEBUG = 'node-slack-mailgun';

var Debug = require('debug');
var debug = Debug('node-slack-mailgun');
var Slack = require('node-slack');
var verifyMailgun = require('./lib/mailgun-verify');
var getTemplate = require('./lib/getTemplate');
var getOptions = require('./lib/getOptions');

/**
 * Module exports.
 */

module.exports = SlackGun;

function SlackGun(options) {
  var that = this || {};

  // Normalize our options and log/throw any problems.
  that.options = getOptions(options);

  // Initalize node-slack
  that.slack = new Slack(options.slack.hook, options.slack.options);

  return function SlackGunMiddleware(req, res) {
    var err = [];

    // Default to trusting the message if we don't
    // have an api key from Mailgun to work with.

    if (that.options.mailgun.apikey) {
      var apikey = that.options.mailgun.apikey;
      if (!req.body.signature) {
        err.push('Body does not contain signature.');
      } else {
        var token = req.body.signature.token;
        var timestamp = req.body.signature.timestamp;
        var signature = req.body.signature.signature;

        var verification = verifyMailgun(apikey, token, timestamp, signature);

        if (!verification.valid) {
          err.push('Invalid token response. Mailgun message could not be authenticated.');
        }
      }
    } else {
      debug('No api key for Mailgun set. Not validating the authenticity of Mailgun\'s request');
    }

    if (!req.body || !req.body['event-data']) {
      err.push('Unable to get body from Mailgun request.');
    } else if (!err.length) {
      const [ messageId, domain ] = req.body['event-data'].message.headers['message-id'].split('@');
      getMessage({
        ...req.body['event-data'],
        messageId,
        domain,
      }, that.options, function (err, message) {
        if (err) {
          debug(err);
        } else if (message) {
          debug('Sending rendered message to Slack.');
          that.slack.send(message, function (err, ok) {
            if (err) {
              debug(err);
            } else {
              debug(ok);
            }
          });
        }
      });
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
}

function getMessage(body, options, callback) {
  debug('Parsing Mailgun message.');

  if(typeof body === 'undefined') {
    return callback('Unable to parse message from Mailgun.');
  }

  if(!body.event) {
    return callback('Event type not sent by Mailgun.');
  } else {
    getTemplate(body, options, callback);
  }
}
