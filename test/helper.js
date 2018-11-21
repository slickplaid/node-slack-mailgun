/* eslint-env node, mocha */
/* global it:false */

var chai = require('chai');

module.exports = {
  assert: chai.assert,
  expect: chai.expect,
  should: chai.should(),
  slackOpts: {
    hook: '123',
    channel: '#custom',
    username: 'custom',
    icon_emoji: 'test',
    options: {
      proxy: 'example.com'
    }
  }
};
