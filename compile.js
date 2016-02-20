'use strict';

var ejs = require('ejs');
var fs = require('fs');
var angularTemplateString = fs.readFileSync('./templates/angular-template.ejs', {
	encoding: 'utf8'
});
var angularTemplateCompiled;

var moduleToCompile;
var moduleName;
var deps;

var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
var ARGUMENT_NAMES = /([^\s,]+)/g;

function getParamNames(func) {
	var fnStr = func.toString().replace(STRIP_COMMENTS, '');
	var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
	if (result === null)
		result = [];
	return result;
}

moduleName = process.argv[2];
moduleToCompile = require(moduleName);
deps = getParamNames(moduleToCompile);
deps = deps.map(function(dep) {
	return '\'' + dep + '\'';
});
console.log('Fn parameters/deps are:', deps);

console.log('angularTemplateString', angularTemplateString);
console.log('Array to string', [1, 2].toString());

angularTemplateCompiled = ejs.render(angularTemplateString, {
	package: {
		name: 'SharedService',
		deps: deps.toString(),
		code: moduleToCompile.toString()
	}
}, {
	escape: function(html) {
		return String(html);
	}
});

console.log('angularTemplateCompiled');
console.log(angularTemplateCompiled);
