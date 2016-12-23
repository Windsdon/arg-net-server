'use strict';

const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
const debug = require('debug')('server:workers');
const async = require('async');

class Workers {
	constructor() {
		this.workers = {};
	}

	load() {
		// Workers are curretly NOT checked for changes until the server is restarted
		debug('Loading workers');
		return new Promise((resolve, reject) => {
			let p = path.join(process.cwd(), 'workers');
			let files = fs.readdirSync(p).filter(v => fs.statSync(path.join(p, v)).isDirectory());
			debug('\tList of workers: ' + files.join(', '));
			async.queue((id, callback) => {
				this.loadWorker(id).then(() => {
					debug(`\tLoaded ${id}`);
					callback();
				}, (err) => {
					debug(`\tFailed to load ${id}: ` + err.message);
					callback(err);
				});
			}).push(files, (err) => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			})
		});
	}

	loadWorker(id) {
		debug('LOAD worker ' + id);
		let workerPath = this.resolvePath(id);

		let w = {};
		w.files = {};
		w.path = workerPath;
		this.workers[id] = w;

		let manifest = require(path.join(workerPath, 'manifest.json'));

		for (let file of manifest.client.files.concat('manifest.json')) {
			let p = path.join(workerPath, file);
			let hash = crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
			w.files[file] = {
				path: p,
				hash: hash,
				name: file
			};
			debug(`\tHash ${file}: ${hash}`);
			w.manifest = manifest;
		}

		// the worker itself is not important here
		// we just need to load the `load.js` file
		return new Promise((resolve, reject) => {
			debug('\tCall load script');
			require(path.join(workerPath, 'load.js'))(w, this).then(manager => {
				debug('\tLoad complete');
				w.manager = manager;
				resolve(w);
			}, reject);
		});
	}

	getWorker(id) {
		if (!this.workers.hasOwnProperty(id)) {
			return null;
		}

		return this.workers[id];
	}

	resolvePath(id) {
		return path.join(process.cwd(), 'workers', id);
	}
}

const workers = new Workers();

module.exports = workers;