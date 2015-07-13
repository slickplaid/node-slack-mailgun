require('./helper');
var getOptions = require('../lib/getOptions');

describe('Option Defaults', function() {

	describe('Slack', function() {
		it('Throw if no Slack apikey', function() {
			expect(getOptions).to.throw(Error);
		});

		it('Give proper defaults', function() {
			var opts = getOptions({ slack: { hook: '123' }});
			expect(opts.slack).to.have.all.keys(['hook', 'channel', 'username', 'icon_emoji']);
		});

		it('Allow overriding defaults', function() {
			var opts = getOptions({ slack: slackOpts });
			expect(opts.slack).to.eql(slackOpts);
		});
	});

	describe('Mailgun', function() {
		it('Create blank object', function() {
			var opts = getOptions({ slack: slackOpts });
			expect(opts.mailgun).to.exist;
		});
		
		it('Allow no API key', function() {
			var opts = getOptions({ slack: slackOpts });
			expect(opts.mailgun.apikey).to.not.exist;
		});
	});

});