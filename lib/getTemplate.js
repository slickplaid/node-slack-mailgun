'use strict';

var mustache = require('mustache').render;
var Debug = require('debug');
var debug = Debug('node-slack-mailgun:getTemplate');
var defaultTemplates = require('./mustacheTemplates');

module.exports = getTemplate;

function getTemplate(body, options, callback) {
  var ev = body.event;

  var message = {
    channel: options.slack.channel,
    username: options.slack.username,
    icon_emoji: options.slack.icon_emoji,
    unfurl_links: true
  };

  var custom = getCustomTemplate(ev, options);

  if(typeof custom === 'function') {
    debug('Starting custom template function.');
    custom(body, function(err, template) {
      debug('Custom template function ended in +NNNms.');
      if(err) {
        return callback(err);
      }

      if(typeof template === 'string') {
        debug('Using template string provided by template function.');
        message.text = template;
        return callback(err, message);
      }

      if(Array.isArray(template) && template.length) {
        debug('Using attachment array from template function.');
        message.attachment = template;
        return callback(err, message);
      }

      debug('We were unable to parse your custom template function.');
      return callback('Error rendering custom template function.');
    });
  } else if(typeof custom === 'string') {
    debug('Using custom string for template event '+body.event);
    var customText = mustache(custom, body);
    debug('Mustache template finished in +NNNms.');

    message.text = customText;

    return callback(null, message);
  } else if(Array.isArray(custom) && custom.length) {
    // This isn't fully thought out yet, but stubbed to possibly work.
    debug('Using custom attachment array.');
    custom.forEach(function(attachment) {
      for(var name in attachment) {
        var variable = attachment[name];

        if(typeof variable === 'string') {
          attachment[name] = mustache(attachment[name], body);
        }
      }
    });

    // message.attachment = attachment;

    return callback(null, message);
  } else if(custom === true) {
    // Use a default template
    var template = '';
    if(typeof defaultTemplates[body.event] !== 'undefined') {
      debug('Using default template for '+body.event);
      template = defaultTemplates[body.event];
    } else {
      debug('Unknown event '+body.event+' sent from Mailgun. Trying to use the default catch-all template.');
      template = defaultTemplates.all;
    }
    
    debug('Starting mustache template render.');
    var text = mustache(template, body);
    debug('Mustache template finished in +NNNms.');

    message.text = text;

    return callback(null, message);
  } else {
    debug('Template not set or disallowed by settings.');
    return callback('No template available.');
  }
}

function getCustomTemplate(ev, options) {
  if(typeof options.templates !== 'undefined') {
    if(typeof options.templates[ev] !== 'undefined') {
      return options.templates[ev];
    } else if(typeof options.templates.all !== 'undefined') {
      return options.templates.all;
    } else {
      return true;
    }
  } else {
    return true;
  }
}
// eslint-disable-next-line
function renderCustomTemplate(body, template, callback) {
  if(typeof callback !== 'function') {
    callback = function(){};
  }

  if(typeof template === 'function') {
    template(body, callback);
  }

  // if(typeof template === 'string') {

  // }
}