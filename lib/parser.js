'use strict';

module.exports.getDependencies = function(str) {
	var result;

	var tmp;


	tmp = str
		.split('\n')
		.map(function(el){
			return el.match(/require\(.*/);
		})
		.filter(function(el){
			return el;
		})
		.map(function(el) {
				return el[0].replace(/require\(./gi, '').replace(/("|').*$/gi,'');
		});

	return tmp;
}