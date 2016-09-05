module.exports = callpack;

/**
 * Wrap a callback function to pack all value arguments into a single object.
 *
 * @param {Function} cb the callback that may accept more than one value argument
 * @param {string[]} [names] create a key for each positional argument
 * @returns {Object} an array-like object if no names specified
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
		var a = arguments;

		if (names.length > 0 && arguments.length > 0) {
			arguments = Object.assign.apply(null, names.map(function(name, index) {
				return {[name]: a[index]};
			}));
		}

		cb(err, arguments);
	};
}
