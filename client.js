/* jshint node:true */
'use strict';

var sp = require('./shared-pack');

sp.run({
	filename: __dirname + '/examples/data-source-filter.js'
}, function(err, result) {
	if (err) {
		console.log(err);
	} else {
		console.log(result);
	}
});