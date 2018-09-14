var chai = require('chai');
assert = chai.assert;
expect = chai.expect;
chai.should();

slackOpts = { hook: '123', channel: '#custom', username: 'custom', icon_emoji: 'test', options: { proxy: 'example.com' } };
