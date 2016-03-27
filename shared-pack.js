/* jshint node:true */
'use strict';

var ejs = require('ejs');
var fs = require('fs');
var async = require('async');
var path = require('path');
var Logger = new(require('grunt-legacy-log').Log)();
var beautify = require('js-beautify').js_beautify;
var paramCase = require('param-case');

var angularTemplateString = fs.readFileSync(path.resolve(__dirname, './templates/angular-template.ejs'), {
	encoding: 'utf8'
});
var nodeTemplateString = fs.readFileSync(path.resolve(__dirname, './templates/node-template.ejs'), {
	encoding: 'utf8'
});

var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
var ARGUMENT_NAMES = /([^\s,]+)/g;

function getParamNames(func) {
	var fnStr = func.toString().replace(STRIP_COMMENTS, '');
	var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
	if (result === null)
		result = [];
	return result;
}

function getMethods(obj, constructorName) {

	return Object.keys(obj).map(function(methodName) {
		return constructorName + '.prototype.' + methodName + ' = ' + obj[methodName].toString() + ';';
	});

	//return obj.toString();
	// var result = [];
	// for (var id in obj) {
	// 	try {
	// 		if (typeof(obj[id]) == 'function') {
	// 			result.push('this' + '.' + id + ' = ' + obj[id].toString() + ';');
	// 		}
	// 	} catch (err) {

	// 	}
	// }
	// return result;
}

function generateFiles(opts, cb) {
	var packageName, nodeTemplateCompiled, angularTemplateCompiled;
	var buildFolder;

	opts = opts || {};

	packageName = opts.packageName;
	nodeTemplateCompiled = opts.nodeTemplateCompiled;
	angularTemplateCompiled = opts.angularTemplateCompiled;
	buildFolder = path.resolve(process.cwd(), 'build');

	async.waterfall([
		function(next) {
			fs.exists(buildFolder, function(result) {
				next(null, result);
			});
		},
		function(isFolderExisting, next) {
			if (isFolderExisting) {
				return next();
			}
			Logger.writeln('Creating folder: ' + buildFolder);
			return fs.mkdir(buildFolder, next);
		},
		function(next) {
			var filename = buildFolder + '/' + packageName + '.angular.js';
			Logger.writeln('Creating file: ' + filename);
			fs.writeFile(filename, beautify(angularTemplateCompiled, {
				indent_size: 4
			}), 'utf8', next);
		},
		function(next) {
			var filename = buildFolder + '/' + packageName + '.node.js';
			Logger.writeln('Creating file: ' + filename);
			fs.writeFile(filename, beautify(nodeTemplateCompiled, {
				indent_size: 4
			}), 'utf8', next);
		}
	], function(err) {
		cb(err);
	});
}

module.exports.generateAngularModuleFromFilename = function(filename) {
	var parsedModule;
	var angularTemplateCompiled;

	parsedModule = parseNodeModuleString({
		filename: filename
	});

	angularTemplateCompiled = ejs.render(angularTemplateString, {
		package: parsedModule
	}, {
		escape: function(html) {
			return String(html);
		}
	});

	return angularTemplateCompiled;


};
var parseNodeModuleString = module.exports.parseNodeModuleString = function parseNodeModuleString(opts) {
	// tmp
	var moduleName;
	var methods;
	// input
	var filename;
	var moduleToCompile;
	// output
	var result;
	var packageName, depsToString, deps, code;
	var constructorName;


	opts = opts || {};
	filename = opts.filename || null;
	//console.log('opts.filename',opts.filename)
	filename = path.resolve(__dirname, filename);

	// input
	moduleName = filename;

	// output
	packageName = moduleName.split('/');
	packageName = packageName[packageName.length - 1].split('.js')[0];
	//packageName = moduleName.replace(/^\.\//gi, '').split('.js')[0];
	moduleToCompile = require(filename);
	constructorName = moduleToCompile.prototype.constructor.name;
	methods = getMethods(moduleToCompile.prototype, constructorName);
	//console.log('methods',methods);
	deps = getParamNames(moduleToCompile);
	depsToString = deps.map(function(dep) {
		return '\'' + dep + '\'';
	}).toString();
	Logger.info('>>', moduleToCompile.toString());
	code = moduleToCompile.toString() + '\n\n' + methods.join('\n\n');



	result = {
		name: constructorName,
		depsToString: depsToString,
		deps: deps,
		code: code,
		constructorName: constructorName
	};
	return result;
};

module.exports.run = function(opts, cb) {
	var filename;

	var angularTemplateCompiled;
	var nodeTemplateCompiled;

	var packageName;
	var parsedModule;

	opts = opts || {};
	filename = opts.filename;
	//console.log();
	parsedModule = parseNodeModuleString({
		filename: filename
	});
	angularTemplateCompiled = ejs.render(angularTemplateString, {
		package: parsedModule
	}, {
		escape: function(html) {
			return String(html);
		}
	});

	nodeTemplateCompiled = ejs.render(nodeTemplateString, {
		package: parseNodeModuleString
	}, {
		escape: function(html) {
			return String(html);
		}
	});

	generateFiles({
		packageName: packageName,
		nodeTemplateCompiled: nodeTemplateCompiled,
		angularTemplateCompiled: angularTemplateCompiled
	}, function(err) {
		cb(err);
	});

};