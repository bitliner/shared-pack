function DataSourceFilter() {}

DataSourceFilter.prototype.isCallCenterChannel = function(channel) {
	if (!channel){
		return null;
	}
	return channel.match(/call\-center$/gi);
};

DataSourceFilter.prototype.getRegexToMatchStringNotEndingInCallCenter = function() {
	return /^((?!call.center).)*$/gi;
};

DataSourceFilter.prototype.getRegexToMatchStringEndingInCallCenter = function() {
	return /call\-center$/gi;	
};

DataSourceFilter.prototype._getCallCenterDataFilteringCallback = function() {
	var self = this;
	return function(review){
		return review.review && review.review.channel && self.isCallCenterChannel(review.review.channel);
	};
};

DataSourceFilter.prototype.getFilteringCallback = function(enabledDataSources) {
	if (enabledDataSources.indexOf('call-center')>=0){
		return this._getCallCenterDataFilteringCallback();
	}

	return this._getRatingAndReviewsDataFilteringCallback();
};

DataSourceFilter.run = function(reviews, enabledDataSources) {
	var result;

	if (!reviews){
		return [];
	}

	console.log('DataSourceFilter: Initial Reviews are', reviews.length);
	
	
	if (enabledDataSources.length===2){
		result=reviews;
	}else {
		result=reviews.filter(this.getFilteringCallback(enabledDataSources));
	}


	console.log('DataSourceFilter: Filtered Reviews are', result.length);

	return result;
};

module.exports = DataSourceFilter;