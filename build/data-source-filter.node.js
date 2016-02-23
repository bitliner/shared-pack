function DataSourceFilter() {}

DataSourceFilter.isCallCenterChannel = function (channel) {
	if (!channel){
		return null;
	}
	return channel.match(/call\-center$/gi);
};

DataSourceFilter.getRegexToMatchStringNotEndingInCallCenter = function () {
	return /^((?!call.center).)*$/gi;
};

DataSourceFilter.getRegexToMatchStringEndingInCallCenter = function () {
	return /call\-center$/gi;	
};

DataSourceFilter._getCallCenterDataFilteringCallback = function () {
	var self = this;
	return function(review){
		return review.review && review.review.channel && self.isCallCenterChannel(review.review.channel);
	};
};

DataSourceFilter.getFilteringCallback = function (enabledDataSources) {
	if (enabledDataSources.indexOf('call-center')>=0){
		return this._getCallCenterDataFilteringCallback();
	}

	return this._getRatingAndReviewsDataFilteringCallback();
};

 module.exports = DataSourceFilter();