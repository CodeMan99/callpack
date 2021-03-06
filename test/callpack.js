var test = require('tape');
var callpack = require('..');
var task = function(something, callback) {
	setTimeout(callback, 45, null, something, something + 2);
};
var empty = function(callback) {
	setTimeout(callback, 45, null);
};
var fail = function(message, callback) {
	setTimeout(callback, 45, new Error(message));
};

test('callpack', t => {
	t.test('array-like result', st => {
		task(1, callpack((err, result) => {
			st.error(err, 'did not create an error');
			st.equal(result.length, 2, 'has two values');
			st.equal(result[0], 1, 'first value is correct');
			st.equal(result[1], 3, 'second value is correct');
			st.notOk(Array.isArray(result), 'is not an array');
			st.deepEqual(Array.from(result), [1, 3], 'can be converted to an array');
			st.end();
		}));
	});

	t.test('name positional arguments', st => {
		task('test1', callpack((err, result) => {
			st.error(err, 'did not create an error');
			st.deepEqual(result, {original: 'test1', modified: 'test12'}, 'creates object with two keys');
			st.end();
		}, 'original', 'modified'));
	});

	t.test('name positional arguments (less names)', st => {
		task('tst2', callpack((err, result) => {
			st.error(err, 'did not create an error');
			st.deepEqual(result, {main: 'tst2'}, 'creates object with one key, dropping an argument');
			st.end();
		}, 'main'));
	});

	t.test('name positional arguments (more names)', st => {
		task('t3', callpack((err, result) => {
			st.error(err, 'did not create an error');
			st.deepEqual(result, {unmod: 't3', processed: 't32'}, 'creates object with two keys, dropping a name');
			st.end();
		}, 'unmod', 'processed', 'perfect'));
	});

	t.test('preserve errors', st => {
		fail('preserve', callpack((err, result) => {
			st.ok(err, 'passed into the callback');
			st.equal(err.message, 'preserve', 'message is the same');
			st.end();
		}));
	});

	t.test('callback has no value arguments', st => {
		empty(callpack((err, result) => {
			st.error(err, 'did not create an error');
			st.equal(result && result.length, 0, 'creates an object with no length');
			st.end();
		}));
	});

	t.test('callback has no value arguments (with positional names)', st => {
		empty(callpack((err, result) => {
			st.error(err, 'did not create an error');
			st.equal(result && Object.keys(result).length, 0, 'creates an object with no keys');
			st.end();
		}));
	});

	t.end();
});

test('Pack', t => {
	var Pack = callpack.Pack;
	var pack = new Pack();

	if (typeof Symbol.toStringTag !== 'undefined') {
		t.equal(Object.prototype.toString.call(pack), '[object Pack]', 'has a unique toString tag');
	} else {
		t.pass('class is defined');
	}

	t.end();
});
