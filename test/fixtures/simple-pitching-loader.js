module.exports = function(source) {
	return source + "-simple";
};

module.exports.pitch = function(remainingRequest, previousRequest, data) {
	console.log("simple pitching loader remainingRequest", remainingRequest);
	console.log("simple pitching loader previousRequest", previousRequest);
};
