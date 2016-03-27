'use strict';

function SharedService(param1) {
	console.log('Constructor', param1);
}

SharedService.prototype.sharedMethod = function () {
	console.log('This is a shared method');
};

angular.module('SharedService', ['param1'])
	.factory('SharedService', ['param1', SharedService]);