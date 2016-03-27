'use strict';

var fs = require('fs');
var path = require('path');
var expect = require('chai').expect;
var SharedPack = require('../');

describe('SharedPack', function() {

	describe('Implementation', function() {

		describe('parseNodeModuleString()', function() {


			it('should work fine when it is a simple module as input', function() {
				//var simpleModuleAsString;
				var currentOutput;

				// simpleModuleAsString = require().toString();
				currentOutput = SharedPack.parseNodeModuleString({
					filename: path.resolve(__dirname, './data/simple-module.js')
				});
				currentOutput.code = currentOutput.code.replace(/((\n)|(\t))+/gi, ' ').trim();

				expect(currentOutput).to.be.eql({
					name: 'SharedService',
					depsToString: '\'param1\'',
					deps: ['param1'],
					code: 'function SharedService(param1) { console.log(\'Ola\', param1); }',
					constructorName: 'SharedService'

				});


			});
		});

		describe('getMethods()', function(){
			it('should work correctly', function(){

				

			});
		});

	});

	describe('API', function() {



		describe('Very simple module', function() {

			var rawModule;
			var expectedAngularModule;

			beforeEach(function() {
				rawModule = require('./data/simple-module.js');
				expectedAngularModule = fs.readFileSync(path.resolve(__dirname,'./data/simple-module.angular-expected.js'), {
					encoding: 'utf8'
				});
			});

			describe('generateAngularModuleFromFilename()', function() {
				it('should be compiled corrcetly for angular.js platform', function() {

					// var rawModuleAsString;
					var angularModule;

					angularModule = SharedPack.generateAngularModuleFromFilename(path.resolve(__dirname, './data/simple-module.js'));

					expect(angularModule.replace(/((\n)|(\t))+/gi, ' ').trim()).to.be.equal(expectedAngularModule.replace(/((\n)|(\t))+/gi, ' ').trim());



					// console.log('rawModule', rawModule.toString());

				});

			});
		});
		describe('class based module', function() {

			var rawModule;
			var expectedAngularModule;

			beforeEach(function() {
				rawModule = require('./data/class-module.js');
				expectedAngularModule = fs.readFileSync(path.resolve(__dirname,'./data/class-module.angular-expected.js'), {
					encoding: 'utf8'
				});
			});

			describe('generateAngularModuleFromFilename()', function() {
				it('should be compiled corrcetly for angular.js platform', function() {

					// var rawModuleAsString;
					var angularModule;

					angularModule = SharedPack.generateAngularModuleFromFilename(path.resolve(__dirname, './data/class-module.js'));

					expect(angularModule.replace(/((\n)|(\t))+/gi, ' ').trim()).to.be.equal(expectedAngularModule.replace(/((\n)|(\t))+/gi, ' ').trim());



					// console.log('rawModule', rawModule.toString());

				});

			});
		});

	});



});