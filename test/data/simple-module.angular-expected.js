'use strict';

function SharedService(param1) {
	console.log('Ola', param1);
}

angular.module('SharedService', ['param1'])
	.factory('SharedService', ['param1', SharedService]);