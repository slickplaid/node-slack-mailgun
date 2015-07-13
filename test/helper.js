var chai = require('chai');
assert = chai.assert;
expect = chai.expect;
chai.should();

eventTypes = [
	'opened', 
	'clicked', 
	'unsubscribed', 
	'complained', 
	'bounced', 
	'dropped', 
	'delivered', 
	'all'
];

email = 'joe@domain.com';
domain = 'mg.exampledomain.com';
url = 'https://'+domain+'/path';

eventObjects = {
	opened: { recipient: email, domain: domain },
	clicked: { recipient: email, url: url },
	unsubscribed: { recipient: email, 'mailing-list': 'list@'+domain },
	complained: { recipient: email, domain: domain, 'campaign-id': '123id', 'campaign-name': 'My cool campaign' },
	bounced: { recipient: email, 'event': 'bounced', code: 'xx-500', error: 'Too many dicks', notification: 'There are too many dicks on the dance floor.\nPlease rectify this situation.' },
	dropped: { recipient: email, 'event': 'dropped', reason: 'It was hot.', description: 'We dropped it like it was hot.' },
	delivered: { recipient: email },
	all: { recipient: email, 'event': 'newevent' }
};

slackOpts = { hook: '123', channel: '#custom', username: 'custom', icon_emoji: 'test', options: { proxy: 'example.com' } };
