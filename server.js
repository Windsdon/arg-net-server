'use strict';

process.env.DEBUG = 'server:*';

const nunjucks = require('nunjucks');
const request = require("request");
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const debug = require('debug')('server:main');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fs = require("fs");


var app = express();
var server = require('http').createServer(app);

var nun = nunjucks.configure(path.join(__dirname, 'views'), {
	autoescape: true,
	express: app,
	noCache: true,
	tags: {
		variableStart: '<$',
		variableEnd: '$>',
	}
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(path.join(__dirname, 'bower_components')));

debug('Finished loading basics');

let workers = require('./lib/Workers.js');

workers.load().then(function () {
	debug('Finished loading Workers');

	app.use(require('./lib/Routes.js'));

	debug('Finished loading routes');

	server.listen(80, function () {
		debug('Listening on ' + server.address().port)
	});
})