'use strict';

function SharedService(param1) {
	console.log('Constructor', param1);
}

SharedService.prototype.sharedMethod = function() {
	console.log('This is a shared method');
};

module.exports = SharedService;