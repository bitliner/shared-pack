'use strict';

var ejs = require('ejs');
var fs = require('fs');
var async = require('async');
var path = require('path');
var Logger = new(require('grunt-legacy-log').Log)();



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
			fs.writeFile(filename, angularTemplateCompiled, 'utf8', next);
		},
		function(next) {
			var filename = buildFolder + '/' + packageName + '.node.js';
			Logger.writeln('Creating file: ' + filename);
			fs.writeFile(filename, nodeTemplateCompiled, 'utf8', next);
		}
	], function(err) {
		cb(err);
	});
}



//console.log('Fn parameters/deps are:', deps);

//console.log('angularTemplateString', angularTemplateString);
//console.log('Array to string', [1, 2].toString());



module.exports.run = function(opts, cb) {
	var filename;

	var angularTemplateCompiled;
	var nodeTemplateCompiled;

	var moduleToCompile;
	var moduleName;
	var deps;
	var constructorName;
	var packageName;

	opts = opts || {};
	filename = opts.filename;

	moduleName = filename;
	packageName = moduleName.replace(/^\.\//gi, '').split('.js')[0];
	filename = path.resolve(process.cwd(), filename);
	moduleToCompile = require(filename);
	deps = getParamNames(moduleToCompile);
	constructorName=moduleToCompile.prototype.constructor.name;

	angularTemplateCompiled = ejs.render(angularTemplateString, {
		package: {
			name: constructorName,
			deps: deps.map(function(dep) {
				return '\'' + dep + '\'';
			}).toString(),
			code: moduleToCompile.toString()
		}
	}, {
		escape: function(html) {
			return String(html);
		}
	});
	nodeTemplateCompiled = ejs.render(nodeTemplateString, {
		package: {
			name: constructorName,
			deps: deps
				.map(function(dep) {
					return dep + '.js';
				}).map(function(dep) {
					return 'require(\'' + dep + '\')';
				}).toString(),
			code: moduleToCompile.toString()
		}
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

// console.log('angularTemplateCompiled');
// console.log(angularTemplateCompiled);
// console.log('nodeTemplateCompiled');
// console.log(nodeTemplateCompiled);