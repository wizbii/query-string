(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["queryString"] = factory();
	else
		root["queryString"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var strictUriEncode = __webpack_require__(1);

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

			// missing `=` should be `null`:
			// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
			val = val === undefined ? null : decodeURIComponent(val);

			// is that a stringified object?
			if (/\[[^\]]+]/g.test(key)) {
				// get the key names '[bar]', '[baz]', '[]' from 'foo[bar][baz]=quz'
				var keys = key.match(/\[[^\]]*]/g);

				// extract the actual root key 'foo' from 'foo[bar][baz]=quz'
				key = key.match(/[^[]+/)[0];

				// init it if it's not yet an object, otherwise conserve it
				if (typeof ret[key] !== 'object') {
					ret[key] = {};
				}

				// reduce is used to recursively go deeper and deeper
				keys.reduce(function (r, v, index) {
					// at this point, we already handled the case
					// of the trailing array
					if (v === '[]') {
						return r;
					}

					// remove the brackets
					v = v.replace(/^\[|]$/g, '');

					if (index === keys.length - 1) {
						// if it's the last key from the list,
						// simply set the value
						r[v] = val;
					} else if (keys[index + 1] === '[]') {
						// if the next key is an array,
						// we need to know it now to set the value properly
						if (!Array.isArray(r[v])) {
							r[v] = [];
						}

						r[v].push(val);
					} else if (typeof r[v] !== 'object') {
						// just iterating over the keys tree
						r[v] = {};
					}

					// this is how we're actually going deeper and deeper
					return r[v];
				}, ret[key]);

				return ret;
			}

			var arrayRegexp = /\[]$/;
			var isArray = arrayRegexp.test(key);

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


/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';
	module.exports = function (str) {
		return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
			return '%' + c.charCodeAt(0).toString(16).toUpperCase();
		});
	};


/***/ }
/******/ ])
});
;