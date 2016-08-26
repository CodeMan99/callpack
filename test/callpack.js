var test = require('tape');
var callpack = require('../callpack.js');
var task = function(something, callback) {
	setTimeout(callback, 45, null, something, something + 2);
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

	t.end();
});
