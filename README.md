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

1

### Using it from the command line

2 Not yet implemented

## Usage

`node-slack-mailgun` accepts a few options when initalizing.

```javascript
var SlackGun = require('node-slack-mailgun');

SlackGun({
	slack: { // Options for slack
		hook: 'url', // Required. The hook URL for posting messages to slack.
		options: 'object', // Optional. Options to pass to https://github.com/xoxco/node-slack#install-slack
		channel: '#general', // Optional. By default we'll send to the #general channel.
		username: 'Mailgun', // Optional. By default we'll send using the "Mailgun" username to slack.
		icon_emoji: 'mailbox_with_mail', // Optional. By default we'll set the icon to :mailbox_with_mail:
	},
	mailgun: { // Options for mailgun
		apikey: 'string' // Optional. Used for verifying the HMAC token sent with a request.
	}
});
```

## Customize Messages Sent To Slack

By default we send a generic message rendered by [Mustache.js](https://github.com/janl/mustache.js) as attachments to Slack.

If you want to customize these messages, you have a few options.

### Option #1 - String replacement

Give us a `string` in the options text for slack of that particular type of event, and we'll render it using Mustache and the body of the Mailgun post. You can use any of Slack's input decoractions here as well, such as using \***bold**\* and \_*italics*\_.

If you don't want to write an individual string for each one, just include 'all' in there, and we'll use that for all event types if you don't specifically set one. In the below settings, it would include `[complained, bounced, dropped, delivered]` but not `[opened, clicked, unsubscribed]` because those are specified.

```javascript
var SlackGun = require('node-slack-mailgun');

SlackGun({
	slack: { // Options for slack
		hook: 'url', // Required. The hook URL for posting messages to slack.
	},
	templates: { // Options for templates
		opened: '*{{recipient}}* _{{event}}_ our email.', // "joe@domain.com clicked our email."
		clicked: '*{{recipient}}* _{{event}}_ {{url}}', // "joe@domain.com clicked https://example.com/link"
		unsubscribed: '*{{recipient}}* _{{event}}_ from {{mailing-list}}', // "joe@domain.com unsubscribed from maillist@mydomain.com"
		all: '*{{recipient}}*\n*Event:* _{{event}}_' 
	}
});
```

### Option #2 - Attachment Array

Not yet implemented.

### Option #3 - Custom Function

You can supply us a function and we'll give you the variables. Just give us back the string to use for the text response or an array for the attachment.

```javascript
var SlackGun = require('node-slack-mailgun');

SlackGun({
	slack: { // Options for slack
		hook: 'url', // Required. The hook URL for posting messages to slack.
	},
	templates: { // Options for templates
		all: function(variables, callback) { // callback(error, [string|array]);
			// Do your magic
			// We will not do any manipulation on the string or array you return to us.
			// Just be sure to callback an error (which will halt sending if not null) and the string or array to be used for sending a message to Slack
		} 
	}
});
```

### List of Event Types and Variables from Mailgun

- [opened](https://documentation.mailgun.com/user_manual.html#tracking-opens)
- [clicked](https://documentation.mailgun.com/user_manual.html#tracking-clicks)
- [unsubscribed](https://documentation.mailgun.com/user_manual.html#tracking-unsubscribes)
- [complained](https://documentation.mailgun.com/user_manual.html#tracking-spam-complaints)
- [bounced](https://documentation.mailgun.com/user_manual.html#tracking-bounces)
- [dropped](https://documentation.mailgun.com/user_manual.html#tracking-failures)
- [delivered](https://documentation.mailgun.com/user_manual.html#tracking-deliveries)

## Honey-Do List

- Utilize the real time notification API for Slack. Webhooks are soo 2010.
- Send emails from Slack through Mailgun to the user that received the email by responding to a message in Slack. That'd be cool.
- Expand upon security of replay attacks and other possible security issues using Mailgun's webhooks.