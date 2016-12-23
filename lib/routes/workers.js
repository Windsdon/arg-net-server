'use strict'

const router = require('express').Router();

const workers = require('../Workers.js');
const Errors = require('../Errors.js');
const clone = require('clone');

const debug = require('debug')('server:route:workers');

/**
 * Sends a worker file
 */
router.get('/worker/:id/files/:file', function (req, res) {
	let worker = workers.getWorker(req.params.id);
	if (!worker) {
		return res.status(404).json(Errors.notFound());
	}

	if (!worker.files.hasOwnProperty(req.params.file)) {
		return res.status(404).json(Errors.notFound());
	}

	let file = worker.files[req.params.file];

	res.setHeader('X-Hash', file.hash);
	res.setHeader('X-File-Name', file.name);

	res.sendFile(file.path);
});

/**
 * Sends the worker manifest and some extra data
 */
router.get('/worker/:id', function (req, res) {
	let worker = workers.getWorker(req.params.id);
	if (!worker) {
		return res.status(404).json(Errors.notFound());
	}

	let info = {};
	info.manifest = clone(worker.manifest);
	info.files = clone(worker.files);

	for (let i in info.files) {
		delete info.files[i].path;
	}

	res.json(info);
});

module.exports = router;