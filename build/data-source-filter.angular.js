function DataSourceFilter() {}

var isCallCenterChannel = function (channel) {
	if (!channel){
		return null;
	}
	return channel.match(/call\-center$/gi);
};

var getRegexToMatchStringNotEndingInCallCenter = function () {
	return /^((?!call.center).)*$/gi;
};

var getRegexToMatchStringEndingInCallCenter = function () {
	return /call\-center$/gi;	
};

var _getCallCenterDataFilteringCallback = function () {
	var self = this;
	return function(review){
		return review.review && review.review.channel && self.isCallCenterChannel(review.review.channel);
	};
};

var getFilteringCallback = function (enabledDataSources) {
	if (enabledDataSources.indexOf('call-center')>=0){
		return this._getCallCenterDataFilteringCallback();
	}

	return this._getRatingAndReviewsDataFilteringCallback();
};

angular.module('DataSourceFilter', [])
	.factory('DataSourceFilter', [, DataSourceFilter]);