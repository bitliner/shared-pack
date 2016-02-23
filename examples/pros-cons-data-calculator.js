function ProsConsDataCalculator(DataSourceFilter, pippo) {}

ProsConsDataCalculator.prototype._getFunctionToCalculateAggregatedDataInPercentage = function(reviews, fieldName) {
	return function() {
		var featureName2Data;

		var numberOfReviews;

		numberOfReviews = reviews.length;
		featureName2Data = {};

		reviews.forEach(function processReview(review) {
			var filteredFeature2sentiment;

			var isCallCenterData;

			if (!review.feature2sentiment) {
				return;
			}

			review.feature2sentiment = this.uniquifyTags(review.feature2sentiment);
			isCallCenterData = DataSourceFilter.isCallCenterChannel(review.review.channel);

			if (fieldName === 'category') {
				filteredFeature2sentiment = review.feature2sentiment.reduce(function(acc, el) {
					var sentiment, category,
						hash;

					category = el.category.toLowerCase() || 'no-value';
					sentiment = el.sentiment;
					hash = category + '_' + sentiment;

					if (!acc[hash]) {
						acc[hash] = el;
					}

					return acc;
				}, {});
				filteredFeature2sentiment = Object.keys(filteredFeature2sentiment).map(function(key) {
					return filteredFeature2sentiment[key];
				});
			} else {
				filteredFeature2sentiment = review.feature2sentiment;
			}

			filteredFeature2sentiment.forEach(function processFeature(feature2sentiment) {
				var featureName, sentiment, isPositive, isNegative, isNeutral;

				featureName = feature2sentiment[fieldName];
				if (!featureName) {
					featureName = 'no-value';
				}
				featureName = featureName.trim().toLowerCase();
				sentiment = feature2sentiment.sentiment;
				isPositive = sentiment === 1 || sentiment === '1';
				isNegative = sentiment === 0 || sentiment === '0';
				isNeutral = sentiment === 0.5 || sentiment === '0.5';



				if (!featureName2Data[featureName]) {
					featureName2Data[featureName] = {};
					if (isPositive) {
						featureName2Data[featureName].numberOfPositiveReviews = 1;
						featureName2Data[featureName].numberOfNegativeReviews = 0;
						featureName2Data[featureName].numberOfNeutralReviews = 0;
					}
					if (isNegative) {
						featureName2Data[featureName].numberOfPositiveReviews = 0;
						featureName2Data[featureName].numberOfNegativeReviews = 1;
						featureName2Data[featureName].numberOfNeutralReviews = 0;
					}
					if (isNeutral && !isCallCenterData) {
						featureName2Data[featureName].numberOfPositiveReviews = 1;
						featureName2Data[featureName].numberOfNegativeReviews = 1;
						featureName2Data[featureName].numberOfNeutralReviews = 0;
					}
					if (isNeutral && isCallCenterData) {
						featureName2Data[featureName].numberOfPositiveReviews = 0;
						featureName2Data[featureName].numberOfNegativeReviews = 0;
						featureName2Data[featureName].numberOfNeutralReviews = 1;
					}
				} else {
					if (isPositive) {
						featureName2Data[featureName].numberOfPositiveReviews = featureName2Data[featureName].numberOfPositiveReviews + 1;
					}
					if (isNegative) {
						featureName2Data[featureName].numberOfNegativeReviews = featureName2Data[featureName].numberOfNegativeReviews + 1;
					}
					if (isNeutral && !isCallCenterData) {
						featureName2Data[featureName].numberOfPositiveReviews = featureName2Data[featureName].numberOfPositiveReviews + 1;
						featureName2Data[featureName].numberOfNegativeReviews = featureName2Data[featureName].numberOfNegativeReviews + 1;
					}
					if (isNeutral && isCallCenterData) {
						featureName2Data[featureName].numberOfNeutralReviews = featureName2Data[featureName].numberOfNeutralReviews + 1;
					}
				}
			});
		});

		Object.keys(featureName2Data).forEach(this._getPercentageEnricherIteratorFunc(featureName2Data, numberOfReviews));
		Object.keys(featureName2Data).forEach(this._getDifferenceEnricherIteratorFunc(featureName2Data, numberOfReviews));

		return featureName2Data;
	};
};

ProsConsDataCalculator.prototype._calculateFeature2aggregatedSentimentInPercentage = function(reviews, fieldName) {
	var fn;

	fieldName = fieldName || 'uid';

	fn = this._getFunctionToCalculateAggregatedDataInPercentage(reviews, fieldName);

	return fn();
};

ProsConsDataCalculator.prototype._getDifferenceEnricherIteratorFunc = function(featureName2Data) {
	return function(featureName) {
		var tmp;

		tmp = featureName2Data[featureName];
		tmp.percentageDifference = tmp.percentageOfPositiveReviews - tmp.percentageOfNegativeReviews;
		tmp.absoluteDifference = tmp.numberOfPositiveReviews - tmp.numberOfNegativeReviews;

		return tmp;
	};
};

ProsConsDataCalculator.prototype._getPercentageEnricherIteratorFunc = function(featureName2Data, total) {
	return function(featureName) {
		var tmp;

		tmp = featureName2Data[featureName];
		tmp.percentageOfPositiveReviews = tmp.numberOfPositiveReviews * 100 / total;
		tmp.percentageOfPositiveReviews = Math.round(tmp.percentageOfPositiveReviews);
		tmp.percentageOfNegativeReviews = tmp.numberOfNegativeReviews * 100 / total;
		tmp.percentageOfNegativeReviews = Math.round(tmp.percentageOfNegativeReviews);

		if (tmp.numberOfNeutralReviews) {
			tmp.percentageOfNeutralReviews = tmp.numberOfNeutralReviews * 100 / total;
			tmp.percentageOfNeutralReviews = Math.round(tmp.percentageOfNeutralReviews);
		}


	};
};

ProsConsDataCalculator.prototype._getBestTagKeyFromPercentage = function(featureName2Data) {

	var bestKey, bestValue;

	bestValue = 0;

	Object.keys(featureName2Data).forEach(function(tagKey) {
		var currentDifference = featureName2Data[tagKey].percentageDifference;
		if (currentDifference > bestValue) {
			bestValue = currentDifference;
			bestKey = tagKey;
		}
	});

	return bestKey;
};

ProsConsDataCalculator.prototype._getWorstTagKeyFromPercentage = function(featureName2Data) {

	var worstValue, worstKey;

	worstValue = 100;

	Object.keys(featureName2Data).forEach(function(tagKey) {
		var currentDifference = featureName2Data[tagKey].percentageDifference;
		if (currentDifference < worstValue) {
			worstValue = currentDifference;
			worstKey = tagKey;
		}
	});

	return worstKey;
};

ProsConsDataCalculator.prototype.uniquifyTags = function(input) {
	var hashList;

	if (!input) {
		return [];
	}

	hashList = input.map(function(tag) {
		return tag.uid + '_' + tag.sentiment;
	});

	return input.filter(function(tag, index) {
		var hash;

		hash = tag.uid + '_' + tag.sentiment;

		return hashList.indexOf(hash, index + 1) < 0;
	});
};

module.exports = ProsConsDataCalculator;