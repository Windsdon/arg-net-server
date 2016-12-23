'use strict';

let Errors = {};

Errors.error = function (message, code) {
	return {
		error: {
			code: code || -1,
			message: message || 'Operation failed - No message provided'
		}
	};
}

Errors.notFound = function (message) {
	return Errors.error(message || 'Not found', 404);
}

module.exports = Errors;