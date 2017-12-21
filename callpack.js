module.exports = callpack;
module.exports.Pack = Pack;

/**
 * Wrap a callback function to pack all value arguments into a single object.
 *
 * @param {Function} cb the callback that may accept more than one value argument
 * @param {string[]} [names] create a key for each positional argument
 * @returns {Function} callback wrapper
 * @example
 * async.autoInject({
 * 	page: cb => request('http://www.google.com', callpack(cb)),
 * 	save: ['page', (page, cb) => fs.writeFile('./index.html', page[1], 'utf8', cb)]
 * });
 *
 * @example
 * async.autoInject({
 * 	page: cb => request('http://www.google.com', callpack(cb, 'response', 'body')),
 * 	save: ['page', (page, cb) => fs.writeFile('./index.html', page.body, 'utf8', cb)]
 * });
 */
function callpack(cb/*, ...names*/) {
	var names = [];

	for (var n = 1; n < arguments.length; ++n) {
		names.push(arguments[n]);
	}

	return function() {
		var err = arguments[0];
		var pack = new Pack();
		var i = 0;
		var len = arguments.length - 1;

		if (names.length > 0) {
			len = Math.min(len, names.length);

			for (; i < len; ++i) {
				pack[names[i]] = arguments[i + 1];
			}
		} else {
			Object.defineProperty(pack, 'length', {
				configurable: true,
				enumerable: false,
				value: len,
				writable: true
			});

			for (; i < len; ++i) {
				pack[i] = arguments[i + 1];
			}
		}

		return cb(err, pack);
	};
}

function Pack() {
}

Object.defineProperty(Pack.prototype, Symbol.toStringTag, {
	configurable: true,
	enumerable: false,
	value: 'Pack',
	writable: false
});
