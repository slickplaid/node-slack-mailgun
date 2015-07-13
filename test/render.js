require('./helper');
var getTemplate = require('../lib/getTemplate');
var getOptions = require('../lib/getOptions');
var mustacheTemplates = require('../lib/mustacheTemplates');
var fs = require('fs');
var Mustache = require('mustache');
var body = { recipient: email, url: url, 'event': 'clicked' };

var options = getOptions({ slack: slackOpts });

describe('Basic Render Tests for Mustache', function() {

	beforeEach(function() {
		Mustache.clearCache();
	});

	it('Have default templates for all known event types', function() {
		eventTypes.forEach(function(ev) {
			assert.equal(fs.existsSync('./templates/'+ev+'.mustache'), true);
		});
	});

	it('Render successfully with Mustache', function() {
		eventTypes.forEach(function(ev) {
			var text = Mustache.render(mustacheTemplates[ev], eventObjects[ev]);
			for(var variable in eventObjects[ev]) {
				var word = eventObjects[ev][variable];
				assert.equal(text.indexOf(word) > -1, true);
			}
		}); 
	});

	it('Not fail if variables are missing', function() {
		var text = Mustache.render(mustacheTemplates.dropped, {});
		text.should.be.a('string');
	});

});

describe('getTemplate', function() {

	it('Use default templates', function() {
		getTemplate(body, options, function(err, message) {
			expect(err).to.not.exist;

			var expected = { channel: '#custom',
			  username: 'custom',
			  icon_emoji: 'test',
			  unfurl_links: true,
			  text: '*joe@domain.com* has opened a link: https://mg.exampledomain.com/path' 
			};

			expect(message).to.eql(expected);
		});
	});

	it('Ignore templates set to false', function() {
		var customOptions = { slack: slackOpts };
		customOptions.templates = {
			clicked: false
		};

		getTemplate(body, customOptions, function(err, message) {
			expect(message.text).to.not.be.empty;
		});
	});

	it('Use custom string template', function() {
		var customOptions = { slack: slackOpts };
		customOptions.templates = {
			clicked: '{{recipient}} dropped a click on {{{url}}}'
		};

		getTemplate(body, customOptions, function(err, message) {
			message.text.should.equal('joe@domain.com dropped a click on https://mg.exampledomain.com/path');
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

		getTemplate(body, customOptions, function(err, message) {
			message.text.should.equal('joe@domain.com clicked on https://mg.exampledomain.com/path');
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

		getTemplate(body, customOptions, function(err, message) {
			message.text.should.equal('joe@domain.com clicked on https://mg.exampledomain.com/path');
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

		getTemplate(body, customOptions, function(err, message) {
			message.text.should.equal('joe@domain.com clicked on https://mg.exampledomain.com/path');
		});
	});

	// stubs
	it('allow attachments');
	it('allow custom function attachments');

});