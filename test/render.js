var chai = require('chai');
assert = chai.assert;
expect = chai.expect;
chai.should();
var getTemplate = require('../lib/getTemplate');
var getOptions = require('../lib/getOptions');
var mustacheTemplates = require('../lib/mustacheTemplates');
var fs = require('fs');
var Mustache = require('mustache');
var fixtures = require('./fixtures');

var options = getOptions({ slack: slackOpts });

describe('Basic Render Tests for Mustache', function() {

	beforeEach(function() {
		Mustache.clearCache();
	});

	it('Have default templates for all known event types', function() {
		Object.keys(fixtures.events).forEach(function(ev) {
			assert.equal(fs.existsSync('./templates/'+ev+'.mustache'), true);
		});
	});

	it('Variables used in Mustache templates exist in event-data payload', function() {
		Object.keys(fixtures.events).forEach(function(ev) {
			const variables = mustacheTemplates[ev]
				.match(/{{([\w\d\-\.]+)}}/g)
				.map(variable => variable.replace(/^{{|}}$/g, ''));
			const eventData = fixtures.events[ev]['event-data'];
			variables.forEach((variable) => {
				const keys = variable.split('.');
				const value = keys.reduce((result, key) => result[key], eventData);
				assert.isString(value, `"${variable}" does not exist in the event "${ev}" payload`);
			})
		}); 
	});

	it('Not fail if variables are missing', function() {
		var text = Mustache.render(mustacheTemplates.delivered, {});
		text.should.be.a('string');
	});

});

describe('getTemplate', function() {

	it('Use default templates', function() {
		const eventData = fixtures.events.clicked['event-data'];
		getTemplate(eventData, options, function(err, message) {
			expect(err).to.not.exist;

			var expected = {
				channel: '#custom',
				username: 'custom',
				icon_emoji: 'test',
				unfurl_links: true,
				text: `*${eventData.recipient}* clicked on ${eventData.url}\n<https://app.mailgun.com/app/logs?event=${eventData.event}|View Logs>`
			};

			expect(message).to.eql(expected);
		});
	});

	it('Ignore event types set to false', function() {
		var customOptions = { slack: slackOpts };
		customOptions.templates = {
			clicked: false
		};

		getTemplate(fixtures.events.clicked['event-data'], customOptions, function(err, message) {
			expect(err).to.not.be.empty;
			expect(message).to.be.an('undefined');
		});
	});

	it('Use custom string template', function() {
		var customOptions = { slack: slackOpts };
		customOptions.templates = {
			clicked: '{{recipient}} dropped a click on {{{url}}}'
		};

		getTemplate(fixtures.events.clicked['event-data'], customOptions, function(err, message) {
			message.text.should.equal('alice@example.com dropped a click on https://example.com/i-was-clicked');
		});
	});

	it('Use custom function template', function() {
		var customOptions = { slack: slackOpts };
		customOptions.templates = {
			clicked: function(body, callback) {
				var a = body.recipient+' '+body.event+' on '+body.url;
				callback(null, a);
			}
		};

		getTemplate(fixtures.events.clicked['event-data'], customOptions, function(err, message) {
			message.text.should.equal('alice@example.com clicked on https://example.com/i-was-clicked');
		});
	});

	it('Use custom function template with `all`', function() {
		var customOptions = { slack: slackOpts };
		customOptions.templates = {
			all: function(body, callback) {
				var a = body.recipient+' '+body.event+' on '+body.url;
				callback(null, a);
			}
		};

		getTemplate(fixtures.events.clicked['event-data'], customOptions, function(err, message) {
			message.text.should.equal('alice@example.com clicked on https://example.com/i-was-clicked');
		});
	});

	it('Use custom function template with `all`, override with `clicked`', function() {
		var customOptions = { slack: slackOpts };
		customOptions.templates = {
			clicked: function(body, callback) {
				var a = body.recipient+' '+body.event+' on '+body.url;
				callback(null, a);
			},
			all: function(body, callback) {
				var a = 'failed';
				callback(null, a);
			}
		};

		getTemplate(fixtures.events.clicked['event-data'], customOptions, function(err, message) {
			message.text.should.equal('alice@example.com clicked on https://example.com/i-was-clicked');
		});
	});

	// stubs
	it('allow attachments');
	it('allow custom function attachments');

});