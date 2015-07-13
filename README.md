# Slack Mailgun (SlackGun)

Slack Mailgun (SlackGun) is a simple webhook system to make it easy to route [Mailgun's](http://mailgun.com) [Webhooks](https://documentation.mailgun.com/user_manual.html#webhooks) to [Slack](https://slack.com/). This was built because there existed no simple way that I saw that could map Mailgun to Slack without [paying](https://zapier.com/app/pricing) an arm and a leg for it.

Why pay for it when it's easy enough to simply build?

## Install

You can integrate SlackGun into your existing web application or use it standalone from the command line.

### Using it with Express

`npm install node-slack-mailgun`

```javascript
var SlackGun = require('node-slack-mailgun');
var slack_hook_url = 'https://hooks.slack.com/services/aaa/bbb/ccc';
var mailgun_apikey = '123abc';
var express = require('express');

var app = express();

app.use('/api/mailgun', SlackGun({
	slack: { hook: slack_hook_url },
	mailgun: { apikey: mailgun_apikey }
}));
```

Now any requests from Mailgun to `/api/mailgun` will be routed to slack as a message.

### Using it with the build in `http/s` Node.js Module

#1

### Using it from the command line

#2 Not yet implemented

## Usage

`node-slack-mailgun` accepts a few options when initalizing.

```javascript
var SlackGun = require('node-slack-mailgun');

SlackGun({
	slack: { // Options for slack
		hook: 'url', // Required. The hook URL for posting messages to slack.
		options: 'object' // Optional. Options to pass to https://github.com/xoxco/node-slack#install-slack
	},
	mailgun: { // Options for mailgun
		apikey: 'string' // Optional. Used for verifying the HMAC token sent with a request.
	}
})
```

## Customize Messages Sent To Slack

#3 Not yet implemented.

## Honey-Do List

- Utilize the real time notification API for Slack. Webhooks are soo 2010.
- Send emails from Slack through Mailgun to the user that received the email by responding to a message in Slack. That'd be cool.
- Expand upon security of replay attacks and other possible security issues using Mailgun's webhooks.