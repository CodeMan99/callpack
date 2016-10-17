callpack [![Build Status](https://travis-ci.org/CodeMan99/callpack.svg?branch=master)](https://travis-ci.org/CodeMan99/callpack)
========

Simply wraps a callback to "pack" multiple values into a single object.

Usage
-----

Callpack packs values into an array-like object by default.

    callpack(function(err, result) {
      console.log(result[0] === 1);       // true
      console.log(result[1] === 2);       // true
      console.log(result.length);         // 2
      console.log(Array.isArray(result)); // false
      console.log(Array.from(result));    // [1, 2]
      console.log(result.toString());     // "[object Arguments]"
    })(null, 1, 2);

Callpack packs values into a simple object when you provide names.

    callpack(function(err, result) {
      console.log(result.first);  // "Bill"
      console.log(result.second); // "Thornton"
    }, 'first', 'second')(null, 'Bill', 'Thornton');

Realistic example use case.

    var async = require('async');
    var callpack = require('callpack');
    var fs = require('fs');
    var request = require('request');

    async.auto({
      'page': cb => request('http://www.google.com', callpack(cb, 'response', 'body')),
      'save': ['page', (result, cb) => {
        if (result.page.response.statusCode == 200) {
          fs.writeFile('./index.html', result.page.body, cb);
        } else {
          cb(result.page.response.statusMessage);
        }
      }]
    });

Promisifying a callback library.

    var callpack = require('callpack');
    var promisify = require('es6-promisify');
    var _request = require('request');
    var request = promisify(function() {
      var cbIndex = arguments.length - 1;
      arguments[cbIndex] = callpack(arguments[cbIndex], 'response', 'body');

      _request.apply(_request, arguments);
    });

    request('http://www.google.com').then(result => console.log(result.body), console.error);

Reasoning
---------

Consuming an asynchronous function allows for flexibility, but often tools like
the awesome async library are easier to use with only a single value. How the
function is consumed should be up to the developer, not the library.

Thus callpack doesn't make any assumptions like "multiple values means an array".
Instead the decision is still up the end developer. You may use the result from
callpack as array, convert into an array, or use it to get an object that
closely mimics spreading the arguments over a function.
