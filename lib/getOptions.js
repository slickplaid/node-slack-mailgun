'use strict';

var Debug = require('debug');
var debug = Debug('node-slack-mailgun:getOptions');

function getOptions(options) {

  debug('Setting options');

  if(typeof options === 'undefined') {
    options = {};
  }

  if(typeof options.slack === 'undefined') {
    options.slack = {};
  }

  if(!options.slack.hook) {
    debug('Detected no slack hook url set. Aborting.');
    throw new Error('You need to set a url for slack communication.');
  }

  if(!options.slack.channel) options.slack.channel = '#general';
  if(!options.slack.username) options.slack.username = 'Mailgun';
  if(!options.slack.icon_emoji) options.slack.icon_emoji = 'mailbox_with_mail';

  if(typeof options.mailgun === 'undefined') {
    options.mailgun = {};
  }

  if(!options.mailgun.apikey) {
    debug('Not using Mailgun HMAC verification due to lack of an API key.');
  }

  if(!options.slack.options) {
    debug('No options passed to node-slack.');
  }

  return options;

}

module.exports = getOptions;