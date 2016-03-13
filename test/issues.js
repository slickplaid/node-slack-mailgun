require('./helper');

var express = require('express');
var SlackGun = require('../index');

describe('Github Issues', function() {

	describe('#1 - https://github.com/slickplaid/node-slack-mailgun/issues/1', function() {
		it('Work properly when `this` is not defined', function(done) {
			// app.js
			var slack_hook_url = 'foo';
			var mailgun_apikey = 'bar';

			var app = express();

			expect(
				app.use('/api/mailgun', SlackGun({
					slack: {
						hook: slack_hook_url,
						channel: 'dev_bad_notifications'
					},
					mailgun: { apikey: mailgun_apikey }
				}))
			).to.not.throw('Cannot set property of \'options\' of undefined');

			// $ node app.js

			// /var/www/slackgun/node_modules/node-slack-mailgun/index.js:31
			//         that.options = getOptions(options);
			//                      ^
			// TypeError: Cannot set property 'options' of undefined
			//     at SlackGun (/var/www/slackgun/node_modules/node-slack-mailgun/index.js:31:15)
			//     at Object.<anonymous> (/var/www/slackgun/app.js:8:25)
			//     at Module._compile (module.js:456:26)
			//     at Object.Module._extensions..js (module.js:474:10)
			//     at Module.load (module.js:356:32)
			//     at Function.Module._load (module.js:312:12)
			//     at Function.Module.runMain (module.js:497:10)
			//     at startup (node.js:119:16)
			//     at node.js:929:3

			done();
		});
	});
});