module.exports = callpack;

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
	var names = Array.prototype.slice.call(arguments, 1);

	return function() {
		var err = Array.prototype.shift.call(arguments);
		var len = Math.min(names.length, arguments.length);
		var pack = len == 0 ? arguments : {};

		for (var i = 0; i < len; ++i) {
			pack[names[i]] = arguments[i];
		}

		return cb(err, pack);
	};
}
