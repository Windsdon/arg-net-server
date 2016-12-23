'use strict';

const crypto = require('crypto-js');

module.exports = new Promise((resolve, reject) => {
	setTimeout(function () {
		resolve(function (task, callback) {
			task.$async(() => {
				var r = task.params.string + Math.random().toString(16);
				if (crypto.MD5(r).toString().substr(0, task.params.threshold).match(/^0*$/)) {
					task.result = r;
					callback();
					return true;
				}
				task.solveOne();
				return false;
			})
		});
	}, 2000);
});