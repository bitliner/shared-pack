'use strict';

var fs = require('fs');
var path=require('path');
var expect = require('chai').expect;
var SharedPack = require('../');

describe('SharedPack', function() {

	describe.only('Implementation', function() {

		describe('parseNodeModuleString()', function() {



			it('should work fine when it is a simple module as input', function() {
				//var simpleModuleAsString;
				var currentOutput;

				// simpleModuleAsString = require().toString();
				currentOutput = SharedPack.parseNodeModuleString({
					filename:path.resolve(__dirname,'./data/simple-module.js')
				});
				currentOutput.code=currentOutput.code.replace(/((\n)|(\t))+/gi,' ').trim();

				expect(currentOutput).to.be.eql({
					name: 'simple-module',
					depsToString: '\'param1\'',
					deps: ['param1'],
					code: 'function SharedService(param1) { console.log(\'Ola\', param1); }'
				});


			});
		});

	});

	describe('API', function() {

		describe('Very simple module', function() {
			var rawModule;
			var expectedAngularModule;

			beforeEach(function() {
				rawModule = require('./data/simple-module.js');
				expectedAngularModule = fs.readFileSync('./data/simple-module.angular-expected.js', {
					encoding: 'utf8'
				});
			});

			it('should be compiled corrcetly for angular.js platform', function() {

				var rawModuleAsString;
				var angularModule;

				angularModule = SharedPack.generateAngularModuleFromString(rawModuleAsString);

				expect(angularModule).to.be.equal(expectedAngularModule);



				// console.log('rawModule', rawModule.toString());

			});

		});

	});



});