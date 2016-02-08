'use strict';
var strictUriEncode = require('strict-uri-encode');

exports.extract = function extract(str) {
	return str.split('?')[1] || '';
};

exports.parse = function parse(str) {
	if (typeof str !== 'string') {
		return {};
	}

	str = str.trim().replace(/^(\?|#|&)/, '');

	if (!str) {
		return {};
	}

	return str.split('&').reduce(function (ret, param) {
		var parts = param.replace(/\+/g, ' ').split('=');
		// Firefox (pre 40) decodes `%3D` to `=`
		// https://github.com/sindresorhus/query-string/pull/37
		var key = parts.shift();
		var val = parts.length > 0 ? parts.join('=') : undefined;

		key = decodeURIComponent(key);

		var arrayRegexp = /\[]$/;
		var isArray = arrayRegexp.test(key);

		// missing `=` should be `null`:
		// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
		val = val === undefined ? null : decodeURIComponent(val);

		if (isArray) {
			key = key.replace(arrayRegexp, '');

			if (!Array.isArray(ret[key])) {
				ret[key] = [];
			}

			ret[key].push(val);
		} else {
			ret[key] = val;
		}

		return ret;
	}, {});
};

exports.stringify = function stringify(obj, root) {
	if (!obj) {
		return '';
	}

	return Object.keys(obj)
		.sort()
		.map(function (key) {
			var val = obj[key];

			if (val === undefined) {
				return '';
			}

			if (val === null) {
				return key;
			}

			if (Array.isArray(val)) {
				return val
					.sort()
					.map(function (val2) {
						return strictUriEncode(getKeyValue(key, root) + '[]') + '=' + strictUriEncode(val2);
					})
					.join('&')
				;
			}

			if (typeof val === 'object') {
				return stringify(val, key);
			}

			return strictUriEncode(getKeyValue(key, root)) + '=' + strictUriEncode(val);
		})
		.filter(function (x) {
			return x.length > 0;
		})
		.join('&')
	;
};

function getKeyValue(key, root) {
	return root ? root + '[' + key + ']' : key;
}
