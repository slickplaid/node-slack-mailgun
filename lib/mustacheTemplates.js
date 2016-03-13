'use strict';

var fs = require('fs');
var path = require('path');
var templateDirectory = path.join(__dirname, '..', 'templates');

var defaultTemplates = {
	opened: fs.readFileSync(templateDirectory+'/opened.mustache', 'utf8'),
	clicked: fs.readFileSync(templateDirectory+'/clicked.mustache', 'utf8'),
	unsubscribed: fs.readFileSync(templateDirectory+'/unsubscribed.mustache', 'utf8'),
	complained: fs.readFileSync(templateDirectory+'/complained.mustache', 'utf8'),
	bounced: fs.readFileSync(templateDirectory+'/bounced.mustache', 'utf8'),
	dropped: fs.readFileSync(templateDirectory+'/dropped.mustache', 'utf8'),
	delivered: fs.readFileSync(templateDirectory+'/delivered.mustache', 'utf8'),
	all: fs.readFileSync(templateDirectory+'/all.mustache', 'utf8')
};

module.exports = defaultTemplates;