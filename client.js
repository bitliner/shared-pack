/* jshint node:true */
'use strict';

var sp = require('./shared-pack');

sp.run({
	filename: __dirname + '/examples/pros-cons-data-calculator.js'
}, function(err, result) {
	if (err) {
		console.log(err);
	}
});