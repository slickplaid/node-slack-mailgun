'use strict';

var fs = require('fs');

var defaultTemplates = {
	opened: fs.readFileSync('./templates/opened.mustache', 'utf8'),
	clicked: fs.readFileSync('./templates/clicked.mustache', 'utf8'),
	unsubscribed: fs.readFileSync('./templates/unsubscribed.mustache', 'utf8'),
	complained: fs.readFileSync('./templates/complained.mustache', 'utf8'),
	bounced: fs.readFileSync('./templates/bounced.mustache', 'utf8'),
	dropped: fs.readFileSync('./templates/dropped.mustache', 'utf8'),
	delivered: fs.readFileSync('./templates/delivered.mustache', 'utf8'),
  all: fs.readFileSync('./templates/all.mustache', 'utf8')
};

module.exports = defaultTemplates;