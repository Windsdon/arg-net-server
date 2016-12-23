'use strict';
/**
 * This file is responsible for loading the server-side woker.
 * It should return a promise that resolves to a Manager
 * It's called with it's worker object and the Workers instance
 */

module.exports = function (w, workers) {
	var r = {};

	r.distribute = function () {

	}

	return new Promise((resolve, reject) => {
		resolve(r);
	});
};